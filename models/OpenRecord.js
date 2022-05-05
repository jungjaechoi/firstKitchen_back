module.exports = (sequelize, DataTypes) => {
  const OpenRecord = sequelize.define("OpenRecord", {
    // id, createdAt, updatedAt 자동 생성
    store_id:{
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    start_time:{
      type: DataTypes.STRING(50),
    },
    end_time:{
      type: DataTypes.STRING(50),
    }
  },
  {
<<<<<<< HEAD
    sequelize,
=======
>>>>>>> 75eab397aea4dbbe0779a4cf47ee093f5fb56ff9
    timestamps: true,
    charset: "utf8",
    collate: "utf8_general_ci",
  });
  OpenRecord.associate = (models) => {
      OpenRecord.belongsTo(models.Store, {
          foreignKey: "store_id",
          allowNull: true,
          constraints: false,
          onDelete: "cascade",
      });
  };
  return OpenRecord;
};