
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper module resolution
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
