module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define(
      "Store",
      { 
        agent_id: {
          type: DataTypes.INTEGER(10),
          allowNull: false,
        },
        storeName: {
          type: DataTypes.STRING(50),
          comment: "가게이름",
          allowNULL:false
        },
        storeAddress: {
          type: DataTypes.STRING(60),
          comment: "가게 주소",
          allowNULL:false
        },
        tel: {
          type: DataTypes.STRING(20),
          comment: "전화번호",
          allowNULL:false
        },
        representativeName: {
          type: DataTypes.STRING(30),
          comment: "대표자 이름",
          allowNULL:false
        },
        businessNum: {
          type: DataTypes.STRING(30),
          comment: "사업자번호",
          allowNULL:false
        },
        isOpen: {
          type: DataTypes.Boolean,
          comment: "영업상태",
          allowNULL:false
        },
      },
      {
        timestamps: false,
      }
    );
    Store.associate = (models) => {
      Store.belongsTo(models.Agent, {
        foreignKey: "agent_id",
        allowNull: true,
        constraints: false,
        onDelete: "cascade",
      });
      Store.hasMany(models.ProductUnit, {
        foreignKey: "store_id",
        allowNull: true,
        constraints: false,
      });
      Store.hasMany(models.ProductSet, {
        foreignKey: "store_id",
        allowNull: true,
        constraints: false,
      });
      Store.hasMany(models.ProductOption, {
        foreignKey: "store_id",
        allowNull: true,
        constraints: false,
      });
      Store.hasMany(models.Delivery_proceeding, {
        foreignKey: "store_id",
        allowNull: true,
        constraints: false,
      });
      Store.hasMany(models.Delivery_completed, {
        foreignKey: "store_id",
        allowNull: true,
        constraints: false,
      });
      Store.hasMany(models.OpenRecord, {
        foreignKey: "store_id",
        allowNull: true,
        constraints: false,
      });
    };
    return Store;
  };