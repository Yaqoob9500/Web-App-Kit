export enum BuildMode {
  KOTLIN = "Android WebView (Kotlin)",
  FLUTTER = "Flutter (Dart)",
}

export interface AppConfig {
  url: string;
  appName: string;
  packageId: string;
  icon: string | null; // base64 string, without data:image/png;base64,
  mode: BuildMode;
  options: {
    allowJavaScript: boolean;
    allowFileUploads: boolean;
    pullToRefresh: boolean;
    showSplashScreen: boolean;
    fullScreen: boolean;
    externalLinksInBrowser: boolean;
    offlineCache: boolean;
  };
  advanced: {
    generateKeystore: boolean;
    keystorePath: string;
    keystoreAlias: string;
    keystorePassword: string;
    keyPassword: string;
    versionName: string;
    versionCode: number;
    minSdk: number;
  };
  outputFolder: string;
}

// This interface is no longer needed as we now generate a full project zip.
// export interface GeneratedCode {
//     mainActivity: string;
//     buildGradle: string;
//     androidManifest: string;
//     readme: string;
// }
