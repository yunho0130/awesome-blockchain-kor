const fs = require('fs');
const path = require('path');
const SECRETS_DIR = process.env.SECRETSDIR || '/run/secrets';

function readConfig() {
  if(fs.existsSync(SECRETS_DIR)) {
    const data = JSON.parse(fs.readFileSync(path.resolve(SECRETS_DIR, 'config')).toString());
    data.channelConfig = fs.readFileSync(path.resolve(SECRETS_DIR, 'channel'));
    return data;
  }
}
const config = readConfig();
export default config;