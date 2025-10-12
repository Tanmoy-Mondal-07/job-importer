const xml2js = require('xml2js');

async function xmlToJson(xml) {
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
  return parser.parseStringPromise(xml);
}

module.exports = { xmlToJson };