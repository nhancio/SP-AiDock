# Netlify Deployment Guide

## Prerequisites
- Netlify account
- GitHub repository with your code
- Supabase project with production URL and keys

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

## Step 2: Build Configuration

The following files are already configured:
- `netlify.toml` - Netlify build configuration
- `public/_redirects` - SPA routing support

## Step 3: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard

1. **Go to Netlify Dashboard:**
   - Visit https://app.netlify.com/
   - Click "New site from Git"

2. **Connect GitHub:**
   - Choose "GitHub" as your Git provider
   - Authorize Netlify to access your repositories
   - Select your AiDock repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

4. **Set Environment Variables:**
   - Go to Site settings → Environment variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=https://your-project-ref.supabase.co
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

## Step 4: Configure Supabase for Production

1. **Update Supabase Settings:**
   - Go to your Supabase dashboard
   - Navigate to Authentication → URL Configuration
   - Add your Netlify domain to:
     - Site URL: `https://magicboxai.in`
     - Redirect URLs: `https://magicboxai.in/**`

2. **Update Google OAuth (if using):**
   - Go to Google Cloud Console
   - Update OAuth redirect URIs to include:
     ```
     https://magicboxai.in/auth/callback
     ```

## Step 5: Test Your Deployment

1. **Visit your site:** `https://magicboxai.in`
2. **Test key features:**
   - User registration/login
   - Tool submission
   - Search functionality
   - Profile management

## Step 6: Custom Domain (Optional)

1. **In Netlify Dashboard:**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow the DNS configuration steps

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Node version (should be 18)
   - Verify all dependencies are in package.json
   - Check build logs in Netlify dashboard

2. **Environment Variables Not Working:**
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables
   - Check variable names match exactly

3. **Routing Issues:**
   - Verify `_redirects` file is in `public/` folder
   - Check `netlify.toml` redirects configuration

4. **Supabase Connection Issues:**
   - Verify production URL and keys
   - Check CORS settings in Supabase
   - Update redirect URLs in Supabase dashboard

## Performance Optimization

1. **Enable Netlify Edge Functions** (if needed)
2. **Configure CDN caching** for static assets
3. **Enable compression** in netlify.toml
4. **Optimize images** before upload

## Security

- Environment variables are secure in Netlify
- HTTPS is enabled by default
- Security headers are configured in netlify.toml
