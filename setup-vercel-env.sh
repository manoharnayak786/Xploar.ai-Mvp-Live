# XPLOAR.AI Environment Variables Setup
# Run this in your terminal after connecting to Vercel CLI

echo "Setting up Vercel environment variables..."

# Set environment variables for production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# When prompted, enter: https://meoyfsrpuocdrkzjzbvk.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# When prompted, enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lb3lmc3JwdW9jZHJremp6YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMzM5NjYsImV4cCI6MjA3MTcwOTk2Nn0.Os6sKp9arKMnterPUQhD0Vuhto7U9d3SestIYu8lqEo

echo "Environment variables set. Redeploying..."
vercel --prod

echo "✅ Setup complete!"
