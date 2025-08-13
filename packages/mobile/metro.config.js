const { getExpoConfig } = require("@expo/config");
const { withNativeWind } = require("nativewind/metro");

const config = withNativeWind(getExpoConfig(__dirname), {
	input: "./global.css",
});

const { assetExts, sourceExts } = config.resolver;

// Nettoyage et fusion propre
config.resolver = {
	...config.resolver,
	assetExts: [...assetExts.filter((ext) => ext !== "svg"), "riv"],
	sourceExts: [...sourceExts, "svg", "riv"],
	unstable_enablePackageExports: false,
};

config.transformer = {
	...config.transformer,
	babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

module.exports = config;
