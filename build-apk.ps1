#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build Android APK/AAB for NexaCore CRM

.DESCRIPTION
    This script builds a signed release APK or AAB for Play Store submission.
    Requires: Java JDK 17+, Android SDK, keystore.properties configured

.EXAMPLE
    .\build-apk.ps1 -Type apk
    .\build-apk.ps1 -Type aab
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('apk', 'aab', 'both')]
    [string]$Type = 'both',
    
    [Parameter(Mandatory=$false)]
    [switch]$Clean
)

$projectRoot = Split-Path $PSScriptRoot
$androidDir = Join-Path $projectRoot "android"

Write-Host "📱 NexaCore CRM - Android Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check Java
$javaVersion = java -version 2>&1 | Select-String "version"
if (-not $javaVersion) {
    Write-Error "❌ Java JDK not found. Install JDK 17+ from https://adoptium.net/"
    exit 1
}
Write-Host "☕ Java: $($javaVersion.ToString().Trim())" -ForegroundColor Green

# Check Android SDK
$androidHome = $env:ANDROID_HOME ?? $env:ANDROID_SDK_ROOT
if (-not $androidHome -or -not (Test-Path $androidHome)) {
    Write-Warning "⚠️  ANDROID_HOME not set. Using Gradle wrapper..."
} else {
    Write-Host "🤖 Android SDK: $androidHome" -ForegroundColor Green
}

# Check keystore
$keystoreFile = Join-Path $androidDir "keystore.properties"
if (-not (Test-Path $keystoreFile)) {
    Write-Warning "⚠️  keystore.properties not found!"
    Write-Host "   Copy android/keystore.properties.example to android/keystore.properties" -ForegroundColor Yellow
    Write-Host "   Fill in your keystore details for release signing." -ForegroundColor Yellow
    Write-Host "   Building unsigned debug APK instead..." -ForegroundColor Yellow
    $buildTask = "assembleDebug"
    $outputDir = "build/outputs/apk/debug"
} else {
    Write-Host "🔐 Keystore configured - building RELEASE" -ForegroundColor Green
    $buildTask = "bundleRelease"
    $outputDir = "build/outputs/bundle/release"
}

# Clean if requested
if ($Clean) {
    Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
    Set-Location $androidDir
    .\gradlew clean
    Set-Location $projectRoot
}

# Sync Capacitor
Write-Host "🔄 Syncing Capacitor..." -ForegroundColor Cyan
npx cap sync android

# Build
Write-Host "🔨 Building Android $Type..." -ForegroundColor Cyan
Set-Location $androidDir

if ($Type -eq 'apk' -or $Type -eq 'both') {
    Write-Host "📦 Building APK..." -ForegroundColor Yellow
    .\gradlew assembleRelease
}

if ($Type -eq 'aab' -or $Type -eq 'both') {
    Write-Host "📦 Building AAB (Play Store)..." -ForegroundColor Yellow
    .\gradlew bundleRelease
}

Set-Location $projectRoot

# Show outputs
Write-Host "`n📂 Build outputs:" -ForegroundColor Cyan
$apkFiles = Get-ChildItem "$androidDir\app\build\outputs\apk" -Recurse -Filter "*.apk" -ErrorAction SilentlyContinue
$aabFiles = Get-ChildItem "$androidDir\app\build\outputs\bundle" -Recurse -Filter "*.aab" -ErrorAction SilentlyContinue

if ($apkFiles) {
    foreach ($file in $apkFiles) {
        $size = [math]::Round($file.Length / 1MB, 2)
        Write-Host "   ✅ APK: $($file.FullName) ($size MB)" -ForegroundColor Green
    }
}

if ($aabFiles) {
    foreach ($file in $aabFiles) {
        $size = [math]::Round($file.Length / 1MB, 2)
        Write-Host "   ✅ AAB: $($file.FullName) ($size MB)" -ForegroundColor Green
    }
}

if (-not $apkFiles -and -not $aabFiles) {
    Write-Warning "❌ No build outputs found. Check for errors above."
}

Write-Host "`n🎉 Done!" -ForegroundColor Cyan