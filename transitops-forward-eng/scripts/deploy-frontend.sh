#!/bin/bash
# Deploy TransitOps Frontend to S3 + CloudFront
# Usage: ./deploy-frontend.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$ROOT_DIR/../Transitops_frontend"

BUCKET_NAME="${S3_BUCKET:-transitops-frontend}"
CLOUDFRONT_DIST_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
REGION="${AWS_REGION:-us-east-1}"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        TransitOps Frontend Deployment                   ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Check prerequisites
if ! command -v aws &> /dev/null; then
  echo "❌ AWS CLI not found."
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found."
  exit 1
fi

# Step 1: Build frontend
echo ""
echo "🔨 Building frontend..."
cd "$FRONTEND_DIR"

# Use production API URL if set
if [ -n "${VITE_API_BASE_URL:-}" ]; then
  echo "   Using API URL: $VITE_API_BASE_URL"
fi

npm ci
npm run build

echo "   ✅ Build complete"

# Step 2: Create S3 bucket if it doesn't exist
echo ""
echo "🪣 Checking S3 bucket..."
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "   Creating bucket: $BUCKET_NAME"
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$REGION"
  else
    aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION"
  fi

  # Block public access
  aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
      BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

  echo "   ✅ Bucket created with public access blocked"
else
  echo "   ✅ Bucket exists"
fi

# Step 3: Sync dist to S3
echo ""
echo "📤 Uploading frontend to S3..."
aws s3 sync "$FRONTEND_DIR/dist/" "s3://$BUCKET_NAME/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html" \
  --region "$REGION"

# Upload index.html with no-cache
aws s3 cp "$FRONTEND_DIR/dist/index.html" "s3://$BUCKET_NAME/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --region "$REGION"

echo "   ✅ Files uploaded"

# Step 4: Invalidate CloudFront cache
if [ -n "$CLOUDFRONT_DIST_ID" ]; then
  echo ""
  echo "🔄 Invalidating CloudFront cache..."
  INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DIST_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text \
    --region "$REGION")
  echo "   ✅ Invalidation created: $INVALIDATION_ID"
else
  echo ""
  echo "⚠️  No CLOUDFRONT_DISTRIBUTION_ID set. Skipping cache invalidation."
  echo "   Set it and re-run, or invalidate manually."
fi

echo ""
echo "✅ Frontend deployed successfully!"
echo "   Bucket: s3://$BUCKET_NAME"
if [ -n "$CLOUDFRONT_DIST_ID" ]; then
  echo "   CloudFront: https://$CLOUDFRONT_DIST_ID.cloudfront.net"
fi
