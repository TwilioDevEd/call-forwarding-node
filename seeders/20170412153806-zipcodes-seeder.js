const parsers = require('../utils/parsers');

module.exports = {
  up: queryInterface => parsers.zipsFromCSV().then(
    zipcodes => queryInterface.bulkInsert('ZipCodes', zipcodes, {})
  ),
  down: queryInterface => queryInterface.bulkDelete('ZipCodes', null, {})
};
