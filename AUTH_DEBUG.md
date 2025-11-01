# Authentication Debugging Guide

## Issue: Blank Screen on `/auth/callback`

If you're seeing a blank screen after Google OAuth login, follow these steps:

### 1. Check Browser Console

Open the browser developer console (F12) and look for:
- JavaScript errors
- Console logs from `AuthCallback` component
- Any Supabase errors

### 2. Verify Configuration

#### Supabase Dashboard:
- ✅ **Site URL**: `https://magicboxai.in`
- ✅ **Redirect URLs** should include:
  ```
  http://localhost:5173/auth/callback
  https://magicboxai.in/auth/callback
  ```

#### Google Cloud Console:
- ✅ **Authorized JavaScript origins**:
  ```
  http://localhost:5173
  https://magicboxai.in
  ```
- ✅ **Authorized redirect URIs**:
  ```
  https://kabxfopgmuijyvtsoall.supabase.co/auth/v1/callback
  http://localhost:5173/auth/callback
  https://magicboxai.in/auth/callback
  ```

### 3. Check Environment Variables in Netlify

In Netlify Dashboard → Site Settings → Environment Variables, ensure:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL=https://magicboxai.in`
- `VITE_APP_NAME=MagicBox`

### 4. Common Issues

#### Issue: Code not being exchanged
**Symptom**: URL shows `?code=...` but no session is created

**Solution**: 
- Clear browser localStorage for `magicboxai.in`
- Clear all cookies for the domain
- Try again

#### Issue: Redirect URL mismatch
**Symptom**: Error in Supabase logs about invalid redirect URL

**Solution**:
- Verify redirect URL in Supabase exactly matches: `https://magicboxai.in/auth/callback`
- No trailing slashes
- HTTPS (not HTTP) for production

#### Issue: CORS errors
**Symptom**: Network errors in console about CORS

**Solution**:
- Verify Google Cloud Console authorized origins include `https://magicboxai.in`
- Verify Supabase redirect URLs are correct

### 5. Testing Steps

1. **Clear browser storage**:
   - Open DevTools → Application → Storage
   - Clear localStorage, sessionStorage, and cookies
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

2. **Test login flow**:
   - Go to login page
   - Click "Sign in with Google"
   - After redirect, check console logs
   - Should see: "Auth callback - Code present: true"
   - Should see: "Auth state change: SIGNED_IN"

3. **If still blank**:
   - Check Network tab for failed requests
   - Look for 404 errors (might be routing issue)
   - Check if React app is loading (should see HTML structure)

### 6. Debug Logs

The AuthCallback component logs:
- `Auth callback - Code present: true/false`
- `Auth state change: [event]`
- `Session already exists` (if session found immediately)

Check browser console for these logs to understand where the flow is failing.

