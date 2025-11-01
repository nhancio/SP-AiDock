# Complete Supabase & Google Cloud Console Setup Guide

## 🎯 Overview
This guide will help you configure Supabase and Google Cloud Console (GCP) for MagicBox authentication with both **development** (`localhost:5173`) and **production** (`magicboxai.in`) environments.

---

## 📋 Part 1: Supabase Configuration

### Step 1: Login to Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Login to your account
3. Select your **MagicBox** project

### Step 2: Configure Site URLs

1. Navigate to **Authentication** → **URL Configuration**
2. In the **Site URL** field:
   - **Set to**: `https://magicboxai.in`
   - This is your primary production URL
   - Click **Save**

### Step 3: Configure Redirect URLs

In the **Redirect URLs** section, add the following URLs (one per line):

```
http://localhost:5173/auth/callback
https://magicboxai.in/auth/callback
https://www.magicboxai.in/auth/callback
```

**Important:**
- Add each URL on a separate line
- Make sure there are no trailing slashes
- Click **Save** after adding all URLs

### Step 4: Configure Google OAuth Provider

1. Navigate to **Authentication** → **Providers**
2. Find **Google** in the list
3. Click **Edit** or toggle it **ON** if it's off
4. Enter your Google OAuth credentials:
   - **Client ID**: (You'll get this from Google Cloud Console)
   - **Client Secret**: (You'll get this from Google Cloud Console)
5. **IMPORTANT:** Under **Redirect URLs** or **Additional Settings**, make sure:
   - `http://localhost:5173/auth/callback` is allowed (for dev)
   - `https://magicboxai.in/auth/callback` is allowed (for prod)
6. Click **Save**

### Step 5: Verify Configuration

Your Supabase settings should look like this:

**Site URL:**
```
https://magicboxai.in
```

**Redirect URLs:**
```
http://localhost:5173/auth/callback
https://magicboxai.in/auth/callback
https://www.magicboxai.in/auth/callback
```

---

## 🌐 Part 2: Google Cloud Console (GCP) Configuration

### Step 1: Access Google Cloud Console

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Select your project (or create a new one for MagicBox)
3. Make sure **APIs & Services** → **Credentials** is enabled

### Step 2: Find Your OAuth 2.0 Client ID

1. Navigate to **APIs & Services** → **Credentials**
2. Find your **OAuth 2.0 Client ID** (the one used for Supabase)
3. Click on it to **Edit**

### Step 3: Configure Authorized JavaScript Origins

In the **Authorized JavaScript origins** section, add:

```
http://localhost:5173
https://magicboxai.in
https://www.magicboxai.in
```

**Important:**
- Add each URL on a separate line
- No trailing slashes
- Must include `http://` for localhost and `https://` for production

### Step 4: Configure Authorized Redirect URIs

In the **Authorized redirect URIs** section, add:

```
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
```

**To find your Supabase project ref:**
1. Go to Supabase Dashboard → **Settings** → **API**
2. Look at the URL: `https://YOUR_PROJECT_REF.supabase.co`
3. Replace `YOUR_SUPABASE_PROJECT_REF` in the redirect URI above

**Example:**
If your Supabase URL is `https://abcdefghijklmnop.supabase.co`, your redirect URI should be:
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

**Note:** 
- You only need **ONE** redirect URI here (the Supabase one)
- Supabase handles redirecting to your app
- Do NOT add `magicboxai.in/auth/callback` here - that's handled by Supabase

### Step 5: Save Changes

1. Scroll to the bottom
2. Click **Save**
3. Wait a few moments for changes to propagate

---

## 🔍 Part 3: Verification Checklist

### Supabase Checklist:
- [ ] Site URL set to `https://magicboxai.in`
- [ ] Redirect URL `http://localhost:5173/auth/callback` added
- [ ] Redirect URL `https://magicboxai.in/auth/callback` added
- [ ] Redirect URL `https://www.magicboxai.in/auth/callback` added (if using www)
- [ ] Google OAuth provider enabled
- [ ] Google Client ID entered in Supabase
- [ ] Google Client Secret entered in Supabase

### Google Cloud Console Checklist:
- [ ] JavaScript origin `http://localhost:5173` added
- [ ] JavaScript origin `https://magicboxai.in` added
- [ ] JavaScript origin `https://www.magicboxai.in` added (if using www)
- [ ] Redirect URI `https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback` added
- [ ] Changes saved

---

## 🧪 Part 4: Testing

### Test Development (localhost:5173)

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:5173`
3. Click "Sign in with Google"
4. Complete authentication
5. You should be redirected back to `http://localhost:5173` (not `/auth/callback`)

### Test Production (magicboxai.in)

1. Deploy your code to production
2. Go to `https://magicboxai.in`
3. Click "Sign in with Google"
4. Complete authentication
5. You should be redirected back to `https://magicboxai.in` (not `/auth/callback`)
6. **You should NOT see a blank screen**

---

## ❗ Common Issues & Solutions

### Issue 1: Blank Screen on `/auth/callback`

**Cause:** Redirect URLs not configured correctly in Supabase

**Solution:**
1. Check Supabase → Authentication → URL Configuration
2. Make sure `https://magicboxai.in/auth/callback` is in Redirect URLs
3. Wait 2-3 minutes for changes to propagate
4. Clear browser cache and try again

### Issue 2: "redirect_uri_mismatch" Error

**Cause:** Redirect URI not configured in Google Cloud Console

**Solution:**
1. Go to GCP → Credentials → OAuth 2.0 Client ID
2. Make sure `https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback` is in Authorized redirect URIs
3. Save and wait a few minutes

### Issue 3: Redirects to Old Domain (aidockapp.netlify.app)

**Cause:** Site URL still set to old domain

**Solution:**
1. Go to Supabase → Authentication → URL Configuration
2. Change Site URL from `https://aidockapp.netlify.app` to `https://magicboxai.in`
3. Remove old redirect URLs if not needed

### Issue 4: Works in Dev but Not in Production

**Cause:** Missing production redirect URL in Supabase

**Solution:**
1. Add `https://magicboxai.in/auth/callback` to Supabase Redirect URLs
2. Make sure production environment variables are set correctly

---

## 🔐 Part 5: Environment Variables

### Development (.env.local)
```bash
VITE_SUPABASE_URL=https://YOUR_SUPABASE_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Production (Netlify/Vercel/etc.)
Set these in your hosting platform's environment variables:
```bash
VITE_SUPABASE_URL=https://YOUR_SUPABASE_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**To find these values:**
1. Go to Supabase Dashboard → **Settings** → **API**
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## 📝 Quick Reference

### Supabase Redirect URLs (Add these):
```
http://localhost:5173/auth/callback
https://magicboxai.in/auth/callback
https://www.magicboxai.in/auth/callback
```

### GCP JavaScript Origins (Add these):
```
http://localhost:5173
https://magicboxai.in
https://www.magicboxai.in
```

### GCP Redirect URI (Add this ONE):
```
https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback
```

---

## 🆘 Still Having Issues?

1. **Check Supabase Logs:**
   - Dashboard → Logs → Auth Logs
   - Look for error messages

2. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for JavaScript errors

3. **Verify URLs are exact:**
   - No trailing slashes
   - Correct protocol (http vs https)
   - No typos in domain names

4. **Wait for propagation:**
   - Google changes can take 5-10 minutes
   - Supabase changes are usually instant

5. **Clear cache:**
   - Browser cache
   - Service worker cache
   - Try incognito mode

---

## ✅ Success Indicators

When everything is configured correctly:

1. ✅ Sign in button works on both dev and prod
2. ✅ Google OAuth popup appears
3. ✅ After authentication, you're redirected to home page
4. ✅ No blank screen on `/auth/callback`
5. ✅ User is logged in and can see profile
6. ✅ Session persists across page refreshes

---

**Last Updated:** After MagicBox rebranding and domain migration to `magicboxai.in`

