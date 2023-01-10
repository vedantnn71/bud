const { content, ...config } = require("@beacon/config/tailwind.config.cjs");

module.exports = {
  content: ["./apps/web/src/**/*.tsx", "./packages/*/src/**/*.tsx"],
  ...config,
}

