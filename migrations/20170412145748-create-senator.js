module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Senators', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    StateId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      allowNull: true,
      references: {
        model: 'States',
        key: 'id'
      }
    }
  }),
  down: queryInterface => queryInterface.dropTable('Senators')
};
