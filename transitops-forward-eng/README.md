# TransitOps - Deployment Runbook

> Serverless-first deployment on AWS. Zero idle cost. Scale to zero.

## Architecture

```
Browser → CloudFront (CDN) → S3 (Frontend)
                            → API Gateway → Lambda (Backend) → Neon PostgreSQL
```

**Stack:**
- **Compute:** AWS Lambda (Node.js 20) — pay per request, scale to zero
- **API:** AWS API Gateway (HTTP API) — $1 per million requests
- **Database:** Neon PostgreSQL (serverless) — scales to zero, free tier: 500 MB
- **Frontend:** S3 + CloudFront — global CDN, HTTPS out of the box
- **Auth:** JWT via backend middleware

## Prerequisites

1. AWS Account (free tier eligible)
2. [AWS CLI](https://aws.amazon.com/cli/) installed
3. [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed
4. [Node.js 20+](https://nodejs.org/) installed
5. [Neon account](https://console.neon.tech) (free tier)

## Quick Start (30 minutes)

### Step 1: Create Neon Database (5 min)

1. Sign up at https://console.neon.tech
2. Create a new project: `transitops`
3. Copy the **pooler** connection string:
   ```
   postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/transitops
   ```
4. Run schema and seed:
   ```bash
   export DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/transitops"
   ./scripts/seed-db.sh
   ```

### Step 2: Deploy Backend to Lambda (10 min)

```bash
# Configure AWS credentials
aws configure

# Set environment variables
export DATABASE_URL="your-neon-connection-string"
export JWT_SECRET="your-min-32-char-secret-key-here"

# Deploy
cd transitops-forward-eng
./scripts/deploy-backend.sh
```

Note the API URL from the output.

### Step 3: Deploy Frontend to S3 + CloudFront (10 min)

```bash
# Set the API URL
export VITE_API_BASE_URL="https://abc123.execute-api.us-east-1.amazonaws.com/prod"
export CLOUDFRONT_DISTRIBUTION_ID="E1234ABCDEF"  # from CloudFront setup

# Deploy
./scripts/deploy-frontend.sh
```

### Step 4: Verify (5 min)

1. Open CloudFront URL in browser
2. Login: `admin@fleetco.com` / `admin123`
3. Check all pages load
4. Test CRUD operations

## Detailed Setup

### AWS IAM Role for Deployment

Create an IAM role with these policies:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*",
        "apigateway:*",
        "cloudformation:*",
        "s3:*",
        "cloudfront:*",
        "logs:*",
        "ssm:GetParameter",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL pooler URL | `postgresql://user:pass@ep-xxx-pooler.neon.tech/transitops` |
| `JWT_SECRET` | JWT signing key (min 32 chars) | `your-super-secret-jwt-key-change-in-production` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront dist ID | `E1234ABCDEF` |
| `VITE_API_BASE_URL` | Production API URL | `https://abc123.execute-api.us-east-1.amazonaws.com/prod` |

### Lambda Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| Runtime | Node.js 20 | LTS, best Lambda performance |
| Memory | 512 MB | Enough for Express + pg pool |
| Timeout | 30 seconds | API Gateway max is 29s |
| Cold start | < 2 seconds | Acceptable for demo |

### CloudFront Caching

| Path Pattern | TTL | Rationale |
|-------------|-----|-----------|
| `/*` (static assets) | 1 year (immutable) | JS/CSS bundles are hashed |
| `/index.html` | No cache | SPA entry point, always fresh |
| `/api/*` | 0 seconds | Dynamic, never cached |

### Neon PostgreSQL

- **Connection pooling:** Use the pooler endpoint for Lambda compatibility
- **Scale to zero:** Free tier pauses after inactivity, resumes on connection
- **Backup:** Neon auto-backs up daily
- **Before demo:** Run `pg_dump` as extra safety

## Demo Reset

Reset database to fresh seed state in < 30 seconds:

```bash
export DATABASE_URL="your-neon-connection-string"
./scripts/demo-reset.sh
```

## Troubleshooting

### CORS Errors

1. Check `ALLOWED_ORIGINS` env var includes CloudFront domain
2. Verify API Gateway CORS config in SAM template
3. Ensure CloudFront is using HTTPS-only

### Lambda Cold Start Too Slow

1. Increase memory to 1024 MB
2. Enable Lambda Provisioned Concurrency (costs money)
3. Keep pool min connections at 1-2

### Database Connection Errors

1. Verify Neon pooler endpoint (not direct connection)
2. Check `DATABASE_URL` format
3. Ensure Lambda has internet access (VPC not needed for Neon)

### 502 Bad Gateway

1. Check Lambda logs in CloudWatch
2. Verify Lambda handler path is correct
3. Check Lambda timeout isn't too low

## Cost Estimate

For a demo with 20 judges:

| Service | Usage | Cost |
|---------|-------|------|
| Lambda | ~1000 requests/day | Free tier (1M/month) |
| API Gateway | ~1000 requests/day | Free tier (1M/month) |
| S3 | 100 MB storage | Free tier |
| CloudFront | 1 GB transfer | Free tier |
| Neon | 500 MB database | Free tier |
| **Total** | | **$0.00** |

## GitHub Actions (CI/CD)

Set these secrets in GitHub repo settings:

- `AWS_ROLE_ARN` — IAM role ARN for deployment
- `DATABASE_URL` — Neon connection string
- `JWT_SECRET` — JWT signing key
- `CLOUDFRONT_DISTRIBUTION_ID` — CloudFront dist ID
- `CLOUDFRONT_DOMAIN` — CloudFront domain

Push to `main` triggers auto-deploy.

## Rollback

```bash
# Rollback backend
aws cloudformation rollback-stack --stack-name transitops-backend

# Rollback frontend (re-upload previous dist/)
aws s3 sync ./previous-dist/ s3://transitops-frontend/ --delete
```

## Security Checklist

- [ ] CORS restricted to CloudFront origin only
- [ ] HTTPS enforced (TLS 1.2+)
- [ ] JWT validation on all API endpoints
- [ ] Secrets in SSM Parameter Store (not env vars)
- [ ] S3 public access blocked
- [ ] CloudFront OAI for S3 access
- [ ] Lambda timeout ≤ 30 seconds
- [ ] No secrets in code or git
- [ ] AWS Budget alert at $5
