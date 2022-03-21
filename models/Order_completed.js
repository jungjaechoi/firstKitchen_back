module.exports = (sequelize, DataTypes) => {
  const Order_completed = sequelize.define("Order_completed", {
    // id, createdAt, updatedAt 자동 생성
    delivery_id:{
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    productUnit_id:{
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    productSet_id:{
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    productOption_id:{
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER(5),
      comment: "수량",
      allowNULL:false
    },
    
  });
    Order_completed.associate = (models) => {
        Order_completed.belongsTo(models.Delivery_completed, {
            foreignKey: "delivery_id",
            allowNull: true,
            constraints: false,
            onDelete: "cascade",
        });
        Order_completed.belongsTo(models.productOption, {
            foreignKey: "productOption_id",
            allowNull: true,
            constraints: false,
        });
        Order_completed.belongsTo(models.productUnit, {
            foreignKey: "productUnit_id",
            allowNull: true,
            constraints: false,
        });
        Order_completed.belongsTo(models.productSet, {
            foreignKey: "productSet_id",
            allowNull: true,
            constraints: false,
        });
    };
    return Order_completed;
  };