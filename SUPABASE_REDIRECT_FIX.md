# Fix Redirect Issue - Update Supabase Configuration

## Problem
After signing in, users are being redirected back to the old Netlify URL (`https://aidockapp.netlify.app`) instead of the new domain (`https://magicboxai.in`).

## Solution
You need to update the redirect URLs in your **Supabase Dashboard**. The code has already been updated, but Supabase stores these settings separately.

## Step-by-Step Instructions

### 1. Login to Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Login to your account
3. Select your MagicBox project

### 2. Update Site URL
1. Navigate to **Authentication** → **URL Configuration** (or **Settings** → **Authentication**)
2. Find the **Site URL** field
3. Change it from: `https://aidockapp.netlify.app` 
4. To: `https://magicboxai.in`
5. Click **Save**

### 3. Update Redirect URLs
1. In the same page, find the **Redirect URLs** section
2. You'll see a list of allowed redirect URLs
3. **Remove** or update the old URL: `https://aidockapp.netlify.app/**`
4. **Add** the new redirect URLs:
   ```
   https://magicboxai.in/**
   https://www.magicboxai.in/**
   https://magicboxai.in/auth/callback
   https://www.magicboxai.in/auth/callback
   ```
5. If you still want to allow the old domain during migration, you can keep both, but make sure the new domain is listed
6. Click **Save**

### 4. Update OAuth Providers (Google OAuth)
If you're using Google OAuth:

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Click on **Google**
3. Find **Authorized redirect URIs** or **Redirect URIs**
4. Update any references from:
   - `https://aidockapp.netlify.app/auth/callback`
5. To:
   - `https://magicboxai.in/auth/callback`
   - `https://www.magicboxai.in/auth/callback`

### 5. Update Google Cloud Console (if using Google OAuth)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, update:
   - Old: `https://aidockapp.netlify.app/auth/callback`
   - New: `https://magicboxai.in/auth/callback`
   - Also add: `https://www.magicboxai.in/auth/callback` (if you use www subdomain)
5. Click **Save**

### 6. Clear Browser Cache
After updating Supabase settings:
1. Clear your browser cache
2. Or use incognito/private mode
3. Test the sign-in flow again

### 7. Test the Fix
1. Go to `https://magicboxai.in`
2. Try signing in with Google
3. After authentication, you should be redirected back to `https://magicboxai.in` instead of the old URL

## Code Changes Already Made
✅ Updated `src/config/environment.ts` - Production redirect URL set to `https://magicboxai.in/auth/callback`
✅ Updated redirect URL logic to force production domain when on magicboxai.in

## Important Notes

1. **The Supabase dashboard settings override the code** - This is why you need to update Supabase even though the code is correct.

2. **Both domains might work temporarily** - During migration, you might want to keep both URLs in the allowed list, but prioritize the new domain.

3. **Propagation time** - Changes in Supabase usually take effect immediately, but sometimes there can be a few minutes delay.

4. **Environment variables** - Make sure your production environment has the correct Supabase URL and keys set.

## Verification Checklist

- [ ] Site URL updated in Supabase Dashboard
- [ ] Redirect URLs updated in Supabase Dashboard
- [ ] Google OAuth redirect URIs updated in Supabase (if using)
- [ ] Google OAuth redirect URIs updated in Google Cloud Console (if using)
- [ ] Tested sign-in flow on new domain
- [ ] Verified redirect goes to `https://magicboxai.in` not `https://aidockapp.netlify.app`

## Still Having Issues?

If you're still being redirected to the old URL after making these changes:

1. **Check Supabase logs**: Go to Supabase Dashboard → Logs → Auth Logs to see what redirect URL is being used
2. **Check browser console**: Look for any errors or redirect messages
3. **Verify environment variables**: Make sure production environment has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. **Hard refresh**: Try Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to clear cache

