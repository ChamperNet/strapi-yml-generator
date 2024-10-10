const fs = require("fs").promises;

async function ensureExists(path, mask = 0o744) {
  try {
    await fs.mkdir(path, {mode: mask, recursive: true});
    console.log(`Directory '${path}' created or already exists.`);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw new Error(`Error creating directory '${path}': ${err.message}`);
    }
  }
}

module.exports = {ensureExists};
