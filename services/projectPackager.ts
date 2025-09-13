import JSZip from 'jszip';
import { AppConfig } from '../types';
import { generateProjectFiles } from './codeGenerator';

// Helper to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

export const createProjectZip = async (config: AppConfig): Promise<Blob> => {
    const zip = new JSZip();
    const files = generateProjectFiles(config);
    const packagePath = config.packageId.replace(/\./g, '/');

    // Add generated files
    zip.file('README.md', files.readme);
    zip.file(`app/src/main/java/${packagePath}/MainActivity.kt`, files.mainActivity);
    zip.file('app/build.gradle', files.buildGradle);
    zip.file('gradle.properties', files.gradleProperties);
    zip.file('app/src/main/AndroidManifest.xml', files.androidManifest);
    zip.file('app/src/main/res/layout/activity_main.xml', files.activityMainLayout);
    zip.file('app/src/main/res/values/strings.xml', files.stringsXml);

    // Add static project files
    zip.file('settings.gradle', getSettingsGradle(config));
    zip.file('build.gradle', getRootBuildGradle());
    zip.file('.gitignore', getGitignore());
    zip.file('app/.gitignore', getAppGitignore());
    zip.file('app/proguard-rules.pro', getProguardRules());
    zip.file('gradlew', getGradlewScript(), { unixPermissions: '755' });
    zip.file('gradlew.bat', getGradlewBatScript());
    zip.file('gradle/wrapper/gradle-wrapper.properties', getGradleWrapperProperties());

    // Basic XML files for Android project
    zip.file('app/src/main/res/xml/backup_rules.xml', getBackupRulesXml());
    zip.file('app/src/main/res/xml/data_extraction_rules.xml', getDataExtractionRulesXml());
    
    // Handle icon
    if (config.icon) {
        const iconBuffer = base64ToArrayBuffer(config.icon);
        const mipmapFolders = [
            'mipmap-mdpi',
            'mipmap-hdpi',
            'mipmap-xhdpi',
            'mipmap-xxhdpi',
            'mipmap-xxxhdpi',
        ];
        mipmapFolders.forEach(folder => {
            zip.file(`app/src/main/res/${folder}/ic_launcher.png`, iconBuffer);
            zip.file(`app/src/main/res/${folder}/ic_launcher_round.png`, iconBuffer);
        });
    }

    // Generate themes.xml for fullscreen option
    if (config.options.fullScreen) {
        zip.file('app/src/main/res/values/themes.xml', getThemesXml());
    }

    return zip.generateAsync({ type: 'blob' });
};

// Content for static files

const getSettingsGradle = (config: AppConfig): string => `
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${config.appName}"
include ':app'
`;

const getRootBuildGradle = (): string => `
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'com.android.application' version '8.2.0' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.0' apply false
}
`;

const getGitignore = (): string => `
*.iml
.gradle
/local.properties
/.idea/
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
`;

const getAppGitignore = (): string => `
/build
`;

const getProguardRules = (): string => `
# Add project specific ProGuard rules here.
# By default, the flags in this file are applied to application variants.
# You can edit this file to include additional rules.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html
`;

const getGradlewScript = (): string => `#!/usr/bin/env sh
#
# Copyright 2015 the original author or authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
DEFAULT_JVM_OPTS=""
APP_NAME="Gradle"
APP_BASE_NAME=\`basename "$0"\`
# Use the maximum available, or set MAX_FD != -1 to use that value.
MAX_FD="maximum"
warn () {
    echo "$*"
}
die () {
    echo
    echo "ERROR: $*"
    echo
    exit 1
}
# OS specific support (must be 'true' or 'false').
cygwin=false
msys=false
darwin=false
nonstop=false
case "\`uname\`" in
  CYGWIN* )
    cygwin=true
    ;;
  Darwin* )
    darwin=true
    ;;
  MINGW* )
    msys=true
    ;;
  NONSTOP* )
    nonstop=true
    ;;
esac
# Attempt to set APP_HOME
# Resolve links: $0 may be a link
PRG="$0"
# Need this for relative symlinks.
while [ -h "$PRG" ] ; do
    ls=\`ls -ld "$PRG"\`
    link=\`expr "$ls" : '.*-> \\(.*\\$\\)'\`
    if expr "$link" : '/.*' > /dev/null; then
        PRG="$link"
    else
        PRG=\`dirname "$PRG"\`"/$link"
    fi
done
APP_HOME=\`dirname "$PRG"\`
# For Cygwin, ensure paths are in UNIX format before anything is touched
if $cygwin ; then
    [ -n "$APP_HOME" ] &&
        APP_HOME=\`cygpath --unix "$APP_HOME"\`
    [ -n "$JAVA_HOME" ] &&
        JAVA_HOME=\`cygpath --unix "$JAVA_HOME"\`
fi
# Attempt to set JAVA_HOME if it's not already set.
if [ -z "$JAVA_HOME" ] ; then
    if $darwin ; then
        [ -x '/usr/libexec/java_home' ] && export JAVA_HOME=\`/usr/libexec/java_home\`
        [ -d "/Library/Java/JavaVirtualMachines/jdk1.8.0_40.jdk/Contents/Home" ] && export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_40.jdk/Contents/Home"
    else
        java_exe_path=\`which java 2>/dev/null\`
        if [ "x$java_exe_path" != "x" ] ; then
            java_exe_path=\`readlink -f "$java_exe_path"\`
            java_home=\`dirname "$java_exe_path"\`
            java_home=\`dirname "$java_home"\`
            export JAVA_HOME="$java_home"
        fi
    fi
fi
# Add search paths for resolving executables.
PATH=$APP_HOME/bin:$PATH
# Determine the Java command to use to start the JVM.
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        JAVACMD="$JAVA_HOME/jre/sh/java"
    else
        JAVACMD="$JAVA_HOME/bin/java"
    fi
    if [ ! -x "$JAVACMD" ] ; then
        die "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME
Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
    fi
else
    JAVACMD="java"
    which java >/dev/null 2>&1 || die "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
fi
# Increase the maximum number of open file descriptors on Mac OS X.
if $darwin; then
    if [ "$MAX_FD" = "maximum" -o "$MAX_FD" = "max" ]; then
        MAX_FD=\`ulimit -H -n\`
    fi
    ulimit -n $MAX_FD
fi
# For Cygwin, switch paths to Windows format before running java
if $cygwin ; then
    APP_HOME=\`cygpath --path --windows "$APP_HOME"\`
    JAVA_HOME=\`cygpath --path --windows "$JAVA_HOME"\`
    CLASSPATH=\`cygpath --path --windows "$CLASSPATH"\`
    CYGWIN_ARGS=\`cygpath --path --windows "$*"\`
fi
# Split up the JVM options only if the variable is not quoted.
if [ -z "\${GRADLE_OPTS+x}" ]; then
    DEFAULT_JVM_OPTS_ARRAY=()
    for arg in $DEFAULT_JVM_OPTS; do
        DEFAULT_JVM_OPTS_ARRAY+=("$arg")
    done
else
    DEFAULT_JVM_OPTS_ARRAY=()
    for arg in $GRADLE_OPTS; do
        DEFAULT_JVM_OPTS_ARRAY+=("$arg")
    done
fi
# For Msys, convert paths to Windows format before running java
if $msys; then
  APP_HOME=\`cygpath -w "$APP_HOME"\`
  CLASSPATH=\`cygpath -w "$CLASSPATH"\`
fi
# Set the working directory to the parent of this script
cd "\`dirname "$0"\`"
# The location of the gradle-wrapper.jar file.
GRADLE_WRAPPER_JAR_PATH="gradle/wrapper/gradle-wrapper.jar"
exec "$JAVACMD" "\\\${DEFAULT_JVM_OPTS_ARRAY[@]}" -jar "$GRADLE_WRAPPER_JAR_PATH" "$@"`;

const getGradlewBatScript = (): string => `@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################
@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal
set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%
@rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=
@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome
set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init
echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
goto fail
:findJavaFromJavaHome
set JAVA_EXE=%JAVA_HOME%\\bin\\java.exe
if exist "%JAVA_EXE%" goto init
echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
goto fail
:init
@rem Get command-line arguments, handling Windowz variants
if not "%OS%" == "Windows_NT" goto win9xME_args
if "%eval[2+2]" == "4" goto 4NT_args
:win9xME_args
@rem Slurp the command line arguments.
set CMD_LINE_ARGS=
set _SKIP=2
:win9xME_args_slurp
if "x%~1" == "x" goto execute
set CMD_LINE_ARGS=%CMD_LINE_ARGS% %~1
shift
goto win9xME_args_slurp
:4NT_args
@rem Get arguments from the 4NT starting shell, resolving variables correctly
set CMD_LINE_ARGS=%*
:execute
@rem Setup the command line
set CLASSPATH=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar
@rem Execute Gradle
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %CMD_LINE_ARGS%
:end
@rem End local scope for the variables with windows NT shell
if "%ERRORLEVEL%"=="0" goto mainEnd
:fail
rem Set variable GRADLE_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code.
if not "" == "%GRADLE_EXIT_CONSOLE%" (
  exit 1
) else (
  exit /b 1
)
:mainEnd
if "%OS%"=="Windows_NT" endlocal
:omega`;

const getGradleWrapperProperties = (): string => `
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;

const getBackupRulesXml = (): string => `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <!-- TODO Add my rules here -->
</full-backup-content>
`;

const getDataExtractionRulesXml = (): string => `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <!-- TODO Add my rules here -->
    </cloud-backup>
    <device-transfer>
        <!-- TODO Add my rules here -->
    </device-transfer>
</data-extraction-rules>
`;

const getThemesXml = (): string => `<resources xmlns:tools="http://schemas.android.com/tools">
    <!-- Base application theme. -->
    <style name="Theme.AppCompat.Light.NoActionBar.FullScreen" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>
</resources>
`;
