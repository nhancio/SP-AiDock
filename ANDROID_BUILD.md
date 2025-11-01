# Android APK Build Guide for AiDock

This guide will help you build and generate an APK file for your AiDock Android app.

## Prerequisites

Before you can build the APK, you need to install:

1. **Android Studio** (latest version)
   - Download from: https://developer.android.com/studio
   - Install Android SDK, Android SDK Build-Tools, and Android SDK Platform-Tools

2. **Java Development Kit (JDK)** - Version 11 or higher
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Or use OpenJDK: https://adoptium.net/

3. **Environment Variables** (for macOS/Linux):
   - Add to your `~/.zshrc` or `~/.bashrc`:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     ```

## Building the APK

### Method 1: Using Android Studio (Recommended)

1. **Open the Android project**:
   ```bash
   npm run cap:open
   ```
   This will open Android Studio with your project.

2. **Wait for Gradle sync** to complete (may take a few minutes on first run)

3. **Build the APK**:
   - In Android Studio, go to: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Or use the terminal in Android Studio:
     ```bash
     ./gradlew assembleDebug
     ```

4. **Find your APK**:
   - The APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`
   - For a release APK (signed): `android/app/build/outputs/apk/release/app-release.apk`

### Method 2: Using Command Line

1. **Navigate to the Android directory**:
   ```bash
   cd android
   ```

2. **Build the debug APK**:
   ```bash
   ./gradlew assembleDebug
   ```

3. **Find your APK**:
   - Location: `app/build/outputs/apk/debug/app-debug.apk`

4. **Build the release APK** (requires signing):
   ```bash
   ./gradlew assembleRelease
   ```
   - Location: `app/build/outputs/apk/release/app-release.apk`

## Creating a Release APK (For Distribution)

### Step 1: Generate a Keystore

1. **Create a keystore file**:
   ```bash
   keytool -genkey -v -keystore aidock-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias aidock
   ```

2. **Move the keystore** to the `android/app` directory:
   ```bash
   mv aidock-release-key.jks android/app/
   ```

### Step 2: Configure Signing

1. **Create `android/key.properties`** file:
   ```properties
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=aidock
   storeFile=aidock-release-key.jks
   ```

2. **Update `android/app/build.gradle`** (add this before the `android` block):
   ```gradle
   def keystorePropertiesFile = rootProject.file("key.properties")
   def keystoreProperties = new Properties()
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }
   ```

3. **Update the `android` block** in `android/app/build.gradle`:
   ```gradle
   signingConfigs {
       release {
           keyAlias keystoreProperties['keyAlias']
           keyPassword keystoreProperties['keyPassword']
           storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
           storePassword keystoreProperties['storePassword']
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
       }
   }
   ```

### Step 3: Build the Release APK

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be at: `app/build/outputs/apk/release/app-release.apk`

## Installing the APK on Your Device

### Option 1: Direct Install (via USB)

1. Enable **Developer Options** on your Android device:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
   - Go back to **Settings** → **Developer Options**
   - Enable **USB Debugging**

2. Connect your device via USB

3. Install the APK:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### Option 2: Transfer and Install

1. Copy the APK file to your Android device (via USB, email, or cloud storage)

2. On your device, open the APK file and tap **Install**

3. If prompted, allow installation from unknown sources

## Development Workflow

When you make changes to your web app:

1. **Build the web app**:
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**:
   ```bash
   npm run cap:sync
   ```
   Or use the combined command:
   ```bash
   npm run cap:sync
   ```

3. **Test in Android Studio** or rebuild the APK

## Troubleshooting

### Issue: "SDK location not found"
- Set `ANDROID_HOME` environment variable correctly
- Or create `local.properties` in the `android` folder:
  ```
  sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
  ```

### Issue: Gradle build fails
- Make sure you have Java 11+ installed
- Check that Android SDK is properly installed
- Try: `cd android && ./gradlew clean`

### Issue: APK not installing
- Make sure you enabled "Install from unknown sources" on your device
- Check that the APK is not corrupted (try rebuilding)

### Issue: App crashes on launch
- Check the logs in Android Studio: **Logcat** tab
- Make sure all web assets are synced: `npm run cap:sync`

## Additional Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/guide)
- [Gradle Build System](https://gradle.org/)

## Notes

- The **debug APK** is for testing and development (larger file size)
- The **release APK** is optimized and signed for distribution (smaller, secure)
- Always test on a real device before distributing
- Keep your keystore file secure and backed up!

