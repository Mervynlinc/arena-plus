const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("mjs");

module.exports = withNativewind(config, {
  inlineVariables: false,
  globalClassNamePolyfill: true,
});
