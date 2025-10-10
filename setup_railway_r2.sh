#!/bin/bash
set -e

echo "🚀 Setting up QuickLegalBiz + Vault on Railway + R2"

# --- Prerequisites check
if ! command -v railway &> /dev/null; then
  echo "❌ Railway CLI not found. Installing..."
  npm install -g @railway/cli
fi

# --- Login / init Railway
echo "🔑 Logging in to Railway..."
railway login || true

echo "🧱 Initializing Railway project..."
railway init --name quicklegal-vault --no-confirm

# --- Create Postgres database
echo "📦 Creating Railway Postgres DB..."
railway add --plugin postgresql --name quicklegalvault-db

# --- Link current directory
railway link

# --- Create environment variables
echo "🔐 Adding environment variables..."

read -p "Enter your Cloudflare R2 Account ID: " R2_ACCOUNT_ID
read -p "Enter your Cloudflare R2 Access Key ID: " R2_ACCESS_KEY_ID
read -p "Enter your Cloudflare R2 Secret Access Key: " R2_SECRET_ACCESS_KEY
read -p "Enter your Cloudflare R2 Bucket Name: " R2_BUCKET_NAME
read -p "Enter your Cloudflare R2 Public URL (e.g. https://<bucket>.r2.dev): " R2_PUBLIC_URL

railway variables set \
  DATABASE_URL=$(railway variables get DATABASE_URL) \
  R2_ACCOUNT_ID=$R2_ACCOUNT_ID \
  R2_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID \
  R2_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY \
  R2_BUCKET_NAME=$R2_BUCKET_NAME \
  R2_PUBLIC_URL=$R2_PUBLIC_URL \
  NODE_OPTIONS="--dns-result-order=ipv4first"

# --- Deploy backend service (Vault)
echo "📡 Deploying Vault backend service..."
railway up --service vault-backend

# --- Deploy Next.js frontend
echo "🖥️  Deploying Next.js frontend..."
railway up --service quicklegal-frontend

echo "✅ Deployment complete!"
echo ""
echo "🧩 Next steps:"
echo "  1. Open Railway dashboard: https://railway.app/project"
echo "  2. Check your Postgres DB credentials."
echo "  3. Add these vars to your .env.local for local dev:"
echo ""
echo "DATABASE_URL=$(railway variables get DATABASE_URL)"
echo "R2_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID"
echo "R2_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY"
echo "R2_BUCKET_NAME=$R2_BUCKET_NAME"
echo "R2_PUBLIC_URL=$R2_PUBLIC_URL"
echo ""
echo "Then run: npm run dev  ✅"