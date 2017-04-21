module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'States', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      }
    }
  ),
  down: queryInterface => queryInterface.dropTable('States')
};
