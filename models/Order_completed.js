module.exports = (sequelize, DataTypes) => {
  const Order_completed = sequelize.define("Order_completed", {
    // id, createdAt, updatedAt 자동 생성
    delivery_id:{
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    productUnit_id:{
      type: DataTypes.INTEGER(10),
    },
    productSet_id:{
      type: DataTypes.INTEGER(10),
    },
    productOption_id:{
      type: DataTypes.INTEGER(10),
    },
    quantity: {
      type: DataTypes.INTEGER(5),
      comment: "수량",
      allowNULL:false
    },
    
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  });
    Order_completed.associate = (models) => {
        Order_completed.belongsTo(models.Delivery_completed, {
            foreignKey: "delivery_id",
            allowNull: true,
            constraints: false,
            onDelete: "cascade",
        });
        Order_completed.belongsTo(models.ProductOption, {
            foreignKey: "productOption_id",
            allowNull: true,
            constraints: false,
        });
        Order_completed.belongsTo(models.ProductUnit, {
            foreignKey: "productUnit_id",
            allowNull: true,
            constraints: false,
        });
        Order_completed.belongsTo(models.ProductSet, {
            foreignKey: "productSet_id",
            allowNull: true,
            constraints: false,
        });
    };
    return Order_completed;
  };