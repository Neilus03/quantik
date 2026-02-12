# Quantik Mobile

A simple recreation of the Quantik board game using **React + Vite**.

---

## Can I do everything for you automatically?

I can prepare the project and give you exact commands/files, but I **cannot** complete phone-local and account-bound steps from here (for example: Android Studio signing wizard on your machine, Play Store account setup, and installing to your physical phone).

What I *can* do is provide a copy-paste flow that works end-to-end.

---

## Goal

You want two things:
1. Deploy the web app online.
2. Generate an installable Android APK.

The cleanest setup is:
- **Vite build** for web output (`dist/`)
- **Capacitor** to wrap that web app as an Android app.

---

## Prerequisites (install once)

### 1) Node.js
Install Node 20+ from: https://nodejs.org

Verify:
```bash
node -v
npm -v
```

### 2) Java (JDK 17 recommended)
Install JDK 17.

Verify:
```bash
java -version
```

### 3) Android Studio
Install Android Studio and during setup make sure:
- Android SDK
- Android SDK Platform
- Android Build Tools

Open Android Studio once and let it finish SDK setup.

---

## Step-by-step: from this project to APK

> Run all commands below in the project root (the folder containing `package.json`).

### Step A — install project deps
```bash
npm install
```

### Step B — add Capacitor packages
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step C — initialize Capacitor
```bash
npx cap init "Quantik Mobile" "com.yourname.quantik"
```

- Replace `com.yourname.quantik` with your own reverse-domain ID.
- Example: `com.john.quantik`.

### Step D — set Capacitor web directory
Create or edit **`capacitor.config.ts`** in project root and paste:

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.quantik',
  appName: 'Quantik Mobile',
  webDir: 'dist',
};

export default config;
```

> Important: Keep `appId` exactly the same as in Step C.

### Step E — build web app
```bash
npm run build
```

This creates `dist/`.

### Step F — add and sync Android platform
```bash
npx cap add android
npx cap sync android
```

### Step G — open Android project
```bash
npx cap open android
```

This opens Android Studio.

### Step H — build APK in Android Studio
In Android Studio:
- For quick testing APK:
  - **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- For signed release APK:
  - **Build** → **Generate Signed Bundle / APK** → choose **APK**
  - Create/select keystore
  - Build release

APK output is typically under:
- `android/app/build/outputs/apk/debug/` or
- `android/app/build/outputs/apk/release/`

---

## Install the APK on your phone

### Option 1: manual install
1. Copy APK to phone.
2. Open APK file.
3. Allow install from unknown sources (one-time permission).
4. Install.

### Option 2: ADB (USB)
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## How to update app after code changes

Each time you change code:
```bash
npm run build
npx cap sync android
npx cap open android
```
Then rebuild APK in Android Studio.

---

## Deploy the web version online

You can deploy `dist/` to any static host:
- Vercel
- Netlify
- Cloudflare Pages
- Firebase Hosting
- GitHub Pages

Generic flow:
```bash
npm run build
```
Upload/publish the `dist/` folder on your chosen platform.

---

## Common errors (quick fixes)

### "SDK location not found"
Open Android Studio → SDK Manager → install SDK, then retry build.

### "Gradle build failed"
- Ensure JDK 17 is used by Android Studio.
- Update Android SDK/build tools from SDK Manager.
- Re-run:
```bash
npx cap sync android
```

### App opens old UI
You likely forgot to rebuild/sync.
Run:
```bash
npm run build
npx cap sync android
```

---

## Optional: make it installable from browser too (PWA)

APK and PWA are different:
- APK = native Android package (this guide).
- PWA = browser-installable web app.

If you want, add a PWA plugin later for home-screen install from browser.
