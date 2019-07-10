const ZenhubAPI = require('node-zenhub'),
      { promisifyAll } = require('bluebird'),
      { ZENHUB_API_KEY } = process.env;

if (!ZENHUB_API_KEY) {
  throw new Error('"ZENHUB_API_KEY" was not found, please set it in environment secrets.');
}

module.exports = promisifyAll(new ZenhubAPI(ZENHUB_API_KEY));
