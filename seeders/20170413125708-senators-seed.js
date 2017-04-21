const parsers = require('../utils/parsers');

module.exports = {
  up: queryInterface => parsers.senatorsFromJSON().then(
    senators => queryInterface.bulkInsert('Senators', senators)
  ),
  down: queryInterface => queryInterface.bulkDelete('Senators', null, {})
};
