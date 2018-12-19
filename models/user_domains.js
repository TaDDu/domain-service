module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user_domains", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    domainId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });
};
