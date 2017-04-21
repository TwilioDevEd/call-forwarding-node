module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ZipCodes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    zipcode: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    }
  }),
  down: queryInterface => queryInterface.dropTable('ZipCodes')
};
