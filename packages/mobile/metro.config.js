const { getExpoConfig } = require("@expo/config");
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, "../../");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withNativeWind(getExpoConfig(projectRoot), { input: "./global.css" });

// Monorepo support
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules"), path.resolve(workspaceRoot, "node_modules")];
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
