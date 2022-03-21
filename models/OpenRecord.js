module.exports = (sequelize, DataTypes) => {
    const OpenRecord = sequelize.define("OpenRecord", {
      // id, createdAt, updatedAt 자동 생성
      store_id:{
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      start_time:{
        type: DataTypes.DATE
      },
      end_time:{
        type: DataTypes.DATE
      }
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