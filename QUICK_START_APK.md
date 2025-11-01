# Quick Start: Build APK in 5 Steps

## Prerequisites
- Install [Android Studio](https://developer.android.com/studio)
- Install Java JDK 11+ 
- Set up Android SDK through Android Studio

## Build APK

### Step 1: Build your web app
```bash
npm run build
```

### Step 2: Sync with Capacitor
```bash
npm run cap:sync
```

### Step 3: Open Android Studio
```bash
npm run cap:open
```
Or manually open the `android` folder in Android Studio.

### Step 4: Wait for Gradle sync
Android Studio will automatically sync Gradle. Wait for it to finish (may take a few minutes on first run).

### Step 5: Build APK

**Option A: Using Android Studio GUI**
1. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

**Option B: Using Terminal**
```bash
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Install on Your Phone

1. Enable **Developer Options** on your Android device:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"

2. Connect your phone via USB and run:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

Or transfer the APK file to your phone and install it manually.

## That's It! 🎉

You now have an Android APK of your AiDock app!

For more detailed instructions, see [ANDROID_BUILD.md](./ANDROID_BUILD.md)

