@echo off
REM Build Android APK/AAB for NexaCore CRM
REM Usage: build-apk.bat [apk|aab|both] [clean]

set PROJECT_ROOT=%~dp0
set ANDROID_DIR=%PROJECT_ROOT%android
set TYPE=%~1
set CLEAN=%~2

if "%TYPE%"=="" set TYPE=both

echo 📱 NexaCore CRM - Android Build Script
echo ========================================

REM Check Java
java -version 2>nul | find "version" >nul
if errorlevel 1 (
    echo ❌ Java JDK not found. Install JDK 17+ from https://adoptium.net/
    exit /b 1
)
for /f "tokens=3 delims= " %%a in ('java -version 2^>^&1 ^| find "version"') do set JAVA_VER=%%a
echo ☕ Java: %JAVA_VER%

REM Check keystore
if not exist "%ANDROID_DIR%\keystore.properties" (
    echo ⚠️  keystore.properties not found!
    echo    Copy android\keystore.properties.example to android\keystore.properties
    echo    Fill in your keystore details for release signing.
    echo    Building unsigned debug APK instead...
    set BUILD_TASK=assembleDebug
) else (
    echo 🔐 Keystore configured - building RELEASE
    set BUILD_TASK=bundleRelease
)

REM Clean if requested
if "%CLEAN%"=="clean" (
    echo 🧹 Cleaning previous builds...
    cd /d "%ANDROID_DIR%"
    call gradlew clean
    cd /d "%PROJECT_ROOT%"
)

REM Sync Capacitor
echo 🔄 Syncing Capacitor...
npx cap sync android

REM Build
echo 🔨 Building Android %TYPE%...
cd /d "%ANDROID_DIR%"

if "%TYPE%"=="apk" (
    echo 📦 Building APK...
    call gradlew assembleRelease
) else if "%TYPE%"=="aab" (
    echo 📦 Building AAB (Play Store)...
    call gradlew bundleRelease
) else (
    echo 📦 Building APK...
    call gradlew assembleRelease
    echo 📦 Building AAB (Play Store)...
    call gradlew bundleRelease
)

cd /d "%PROJECT_ROOT%"

echo.
echo 📂 Build outputs:
dir "%ANDROID_DIR%\app\build\outputs\apk\release\*.apk" /b 2>nul
dir "%ANDROID_DIR%\app\build\outputs\bundle\release\*.aab" /b 2>nul

echo.
echo 🎉 Done!