# Supabase OAuth Redirect Configuration

This guide explains how to configure Supabase OAuth redirects for both development and production environments.

## 🔧 **Supabase Dashboard Configuration**

### **1. Development Environment Setup**

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add the following URLs to **Site URL**:
   - `http://localhost:5173`
   - `http://localhost:3000` (if using different port)

4. Add the following URLs to **Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:3000/auth/callback` (if using different port)

### **2. Production Environment Setup**

1. In the same **URL Configuration** section
2. Add your production domain to **Site URL**:
   - `https://your-production-domain.com`

3. Add your production callback URL to **Redirect URLs**:
   - `https://your-production-domain.com/auth/callback`

### **3. Google OAuth Setup**

1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

## 🌐 **Google Cloud Console Configuration**

### **1. Development Environment**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - `http://localhost:3000`

5. Add to **Authorized redirect URIs**:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`

### **2. Production Environment**

1. In the same OAuth 2.0 Client ID settings
2. Add to **Authorized JavaScript origins**:
   - `https://your-production-domain.com`

3. Add to **Authorized redirect URIs**:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`

## 📝 **Environment Variables**

Create the following environment files:

### **`.env.local` (Development)**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
VITE_APP_ENV=development
```

### **`.env.production` (Production)**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-production-domain.com
VITE_APP_ENV=production
```

## 🚀 **Deployment Configuration**

### **For Netlify/Vercel/Other Platforms**

1. Set the environment variables in your deployment platform
2. Make sure your production domain is added to:
   - Supabase Site URL
   - Supabase Redirect URLs
   - Google OAuth Authorized JavaScript origins

### **Testing the Setup**

1. **Development**: 
   - Run `npm run dev`
   - Test Google sign-in
   - Should redirect to `http://localhost:5173/auth/callback`

2. **Production**:
   - Deploy your app
   - Test Google sign-in
   - Should redirect to `https://your-domain.com/auth/callback`

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Invalid redirect URI"**: Check that your redirect URLs match exactly in both Supabase and Google Console
2. **"Site URL mismatch"**: Ensure your Site URL in Supabase matches your app's domain
3. **CORS errors**: Make sure your domain is in the Authorized JavaScript origins

### **Debug Steps:**

1. Check browser console for errors
2. Verify environment variables are loaded correctly
3. Test the redirect URL manually: `https://your-supabase-project.supabase.co/auth/v1/callback`
4. Check Supabase logs in the dashboard

## 📋 **Quick Checklist**

- [ ] Supabase Site URL configured for both dev and prod
- [ ] Supabase Redirect URLs configured for both dev and prod
- [ ] Google OAuth Client ID and Secret configured
- [ ] Google Authorized JavaScript origins configured
- [ ] Google Authorized redirect URIs configured
- [ ] Environment variables set for both environments
- [ ] Tested in development
- [ ] Tested in production
