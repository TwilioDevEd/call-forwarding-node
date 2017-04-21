const parsers = require('../utils/parsers');

module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'States',
    parsers.statesFromJSON().map(state => ({ name: state }))
  ),
  down: queryInterface => queryInterface.bulkDelete('States', null, {})
};
