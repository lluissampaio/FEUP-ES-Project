/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: { $0: "jest", config: "e2e/jest.config.js" },
    jest: { setupTimeout: 120000 },
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/cents.app",
      build:
        "xcodebuild -workspace ios/cents.xcworkspace -scheme cents -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd android && ./gradlew app:assembleDebug app:assembleAndroidTest -DtestBuildType=debug",
      reversePorts: [8081],
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: { type: "iPhone 15" },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: process.env.DETOX_AVD_NAME || "Pixel_Dev",
      },
    },
  },
  configurations: {
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
  },
};
