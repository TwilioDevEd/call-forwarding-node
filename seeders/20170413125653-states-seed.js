'use strict';

const parsers = require('../utils/parsers');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('States', 
      parsers.statesFromJSON().map(
        (state) => { return {name: state}; }
      )
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('States', null, {});
  }
};
