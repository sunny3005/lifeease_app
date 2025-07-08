const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle duplicate dependencies
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Exclude problematic packages that might cause conflicts
config.resolver.blockList = [
  // Block old support library references
  /.*\/node_modules\/.*\/android\/support\/.*/,
];

module.exports = config;