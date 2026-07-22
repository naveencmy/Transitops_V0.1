#!/bin/bash
# Deploy TransitOps Backend to AWS Lambda
# Usage: ./deploy-backend.sh [--build-only]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$ROOT_DIR/../Transitops-backend"
SAM_DIR="$ROOT_DIR/infrastructure/sam"

STACK_NAME="transitops-backend"
REGION="${AWS_REGION:-us-east-1}"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        TransitOps Backend Deployment                    ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI not found. Install it first."
  exit 1
fi

# Check SAM CLI
if ! command -v sam &> /dev/null; then
  echo "❌ SAM CLI not found. Install it first."
  exit 1
fi

# Check if stack exists
STACK_EXISTS=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query 'Stacks[0].StackStatus' \
  --output text 2>/dev/null || echo "DOES_NOT_EXIST")

echo ""
echo "📦 Building Lambda layer..."
cd "$BACKEND_DIR"
npm ci --omit=dev

# Create layer structure
LAYER_DIR="$SAM_DIR/../../backend/layer/nodejs"
rm -rf "$LAYER_DIR"
mkdir -p "$LAYER_DIR"
cp -r "$BACKEND_DIR/node_modules" "$LAYER_DIR/"
cp "$BACKEND_DIR/package.json" "$LAYER_DIR/"

echo "🔨 Building SAM application..."
cd "$SAM_DIR"
sam build --use-container 2>/dev/null || sam build

echo ""
if [ "$STACK_EXISTS" = "DOES_NOT_EXIST" ]; then
  echo "🚀 Creating new stack..."
  sam deploy \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
    --resolve-s3 \
    --no-confirm-changeset \
    --no-fail-on-empty-changeset
else
  echo "🔄 Updating existing stack..."
  sam deploy \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
    --resolve-s3 \
    --no-confirm-changeset
fi

echo ""
echo "📋 Stack Outputs:"
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query 'Stacks[0].Outputs[*].{Key:OutputKey,Value:OutputValue}' \
  --output table

API_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)

echo ""
echo "✅ Backend deployed successfully!"
echo "   API URL: $API_URL"
echo "   Health:  $API_URL/api/v1/health"
echo ""

# Test health endpoint
echo "🔍 Testing health endpoint..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/v1/health" 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
  echo "   ✅ Health check passed!"
else
  echo "   ⚠️  Health check returned HTTP $HTTP_STATUS (may need a moment to warm up)"
fi
