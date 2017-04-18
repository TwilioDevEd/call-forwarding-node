'use strict';

const parsers = require('../utils/parsers');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return parsers.senatorsFromJSON().then(
      (senators) => {
        return queryInterface.bulkInsert('Senators', senators);
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Senators', null, {});
  }
};
