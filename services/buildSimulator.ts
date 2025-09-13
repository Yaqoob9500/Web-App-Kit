
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const runBuildSimulator = async (onLog: (log: string) => void) => {
    await sleep(500);
    onLog("Validating configuration...");
    await sleep(300);
    onLog("Configuration valid.");
    await sleep(500);
    onLog("Generating project structure...");
    await sleep(800);
    onLog("Scaffolding Android (Kotlin) project...");
    await sleep(1000);
    onLog("> Task :app:preBuild UP-TO-DATE");
    await sleep(200);
    onLog("> Task :app:preReleaseBuild UP-TO-DATE");
    await sleep(200);
    onLog("> Task :app:compileReleaseKotlin");
    await sleep(2500);
    onLog("> Task :app:processReleaseMainManifest");
    await sleep(300);
    onLog("> Task :app:processReleaseResources");
    await sleep(1200);
    onLog("> Task :app:packageRelease");
    await sleep(1500);
    onLog("Signing APK with release key...");
    await sleep(800);
    onLog("> Task :app:assembleRelease");
    await sleep(200);
    onLog("BUILD SUCCESSFUL in 10s");
};

export const getTestToolsLog = (): string[] => {
    return [
        "Running build tools check...",
        "This is a simulation. On a real system, you would need:",
        "1. Java Development Kit (JDK) 17+",
        "   - Check: `java --version`",
        "   - Ensure `JAVA_HOME` environment variable is set.",
        "2. Android SDK",
        "   - Check: `adb version` or look for the SDK in Android Studio.",
        "   - Ensure `ANDROID_HOME` environment variable is set.",
        "3. Gradle Wrapper (included in projects)",
        "   - Check: `./gradlew --version` in a project directory.",
        "For Flutter Mode:",
        "4. Flutter SDK",
        "   - Check: `flutter doctor`",
        "   - Ensure Flutter's bin directory is in your system's PATH.",
        "✅ All checks simulated successfully. Please verify these tools are installed on your machine.",
    ];
};
