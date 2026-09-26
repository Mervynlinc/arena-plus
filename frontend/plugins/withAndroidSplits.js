const { withAppBuildGradle } = require("@expo/config-plugins");

const SPLITS_BLOCK = [
  "",
  "android {",
  "    splits {",
  "        abi {",
  "            enable true",
  "            reset()",
  '            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"',
  "            universalApk false",
  "        }",
  "    }",
  "}",
].join("\n");

function withAndroidAbiSplits(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy" && !config.modResults.contents.includes("splits {")) {
      config.modResults.contents += SPLITS_BLOCK;
    }
    return config;
  });
}

module.exports = withAndroidAbiSplits;
