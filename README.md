# 🚀 Web App Kit

**The fastest way to turn your website or web application into a native Android app.**

Web App Kit is a powerful tool that takes any website URL and generates a complete, ready-to-build Android project. Configure your app’s name, icon, and native features through a simple interface, then download a ZIP file containing everything you need to compile a release-ready APK.  

No Android development experience required — just add your URL and get your build kit.  

---

## ✨ Features

- **🔧 Simple Configuration**  
  Automatically suggests an **App Name** and **Package ID** from your URL.

- **🎨 Custom Branding**  
  Set your app’s name and upload a custom 512×512 PNG icon.

- **⚡ Powerful WebView Options** (toggle with checkboxes):  
  - Allow JavaScript  
  - Enable File Uploads  
  - Pull-to-Refresh  
  - Show a Splash Screen  
  - Full-Screen / Kiosk Mode  
  - Open External Links in a Browser  
  - Enable Offline Caching  

- **🔐 APK Signing**  
  Automatically generates and configures a release keystore, or use your own existing keystore.

- **📌 Version Control**  
  Set the **Version Name** and **Version Code** for your app releases.

- **📦 Instant Project Download**  
  Generates and packages a complete Gradle project into a downloadable `.zip` file — in seconds.

---

## 🖥️ How to Use

1. **Enter URL** → Paste your website’s full URL (e.g., `https://example.com`).  
2. **Customize** → Adjust the auto-filled App Name and Package ID, upload your app icon.  
3. **Select Features** → Check the native functionalities you want to include.  
4. **Advanced (Optional)** → Configure version name, version code, or keystore details.  
5. **Generate & Download** → Click **Generate & Download Project ZIP**.  
   - The console shows a simulated build log.  
   - Your browser downloads the complete project ZIP.  

---

## 📱 Building Your APK (After Download)

The downloaded ZIP contains a standard Android project. To compile it into an APK, install the Android development tools first.

### ✅ Prerequisites
- **Java Development Kit (JDK 17+)**  
  - Verify with: `java --version`  
  - Ensure `JAVA_HOME` is set correctly.  

- **Android SDK**  
  - Best installed via **Android Studio**.  
  - Ensure `ANDROID_HOME` points to your SDK location.  

---

### 🛠️ Build Steps

1. **Unzip the File** → Extract the contents of the `.zip`.  
2. **Open a Terminal** → Navigate into the extracted project folder.  
3. **Run the Build Command**:

   **Windows:**
   ```bash
   .\gradlew.bat assembleRelease

**macOS / Linux:**
chmod +x ./gradlew
./gradlew assembleRelease

**Find Your APK → After build, your signed, installable APK will be here:**

app/build/outputs/apk/release/app-release.apk
