const fs = require('fs');
const path = require('path');
const SECRETS_DIR = '../configuration';

function readConfig() {
  if(fs.existsSync(SECRETS_DIR)) {
    const data = JSON.parse(fs.readFileSync(path.resolve(SECRETS_DIR, 'config.json')).toString());
    data.channelConfig = fs.readFileSync(path.resolve(SECRETS_DIR, 'channel.tx'));
    return data;
  }
}
const config = readConfig();
export default config;