const os = require("os");
const fs = require("fs-extra");
const path = require("path");

const platforms = {
  win32: {
    pluginsFolderPath:
      "%appdata%\\Elgato\\StreamDeck\\Plugins\\com.elgato.StreamDeck\\Plugins\\"
  },
  darwin: {
    pluginsFolderPath:
      "/~/Library/Application\\ Support/com.elgato.StreamDeck/Plugins/"
  }
};

const currentPlatform = platforms[os.platform()];

if (!currentPlatform) {
  console.error(
    "Current Platform not supported. Supported platforms are: 'win32', 'darwin'"
  );
  process.exit(-1);
}

fs.copySync(
  "build/com.<%%projectNamespace%%>.<%%projectName%%>.sdPlugin",
  path.resolve(currentPlatform.pluginsFolderPath)
);
