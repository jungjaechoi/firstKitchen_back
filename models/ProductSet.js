module.exports = (sequelize, DataTypes) => {
    const ProductSet = sequelize.define("ProductSet", {
      // id, createdAt, updatedAt 자동 생성
      store_id:{
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(20),
        comment: "메뉴이름",
        allowNULL:false
      },
      price: {
        type: DataTypes.INTEGER(10),
        comment: "메뉴가격",
        allowNULL:false
      },
      memo: {
        type: DataTypes.STRING(200),
        comment: "메뉴설명",
      },
      isRecommended: {
        type: DataTypes.BOOLEAN(1),
        comment: "메뉴추천",
        defaultValue: 0
      }
      
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    });
    ProductSet.associate = (models) => {
        ProductSet.hasMany(models.Order, {
            foreignKey: "productSet_id",
            allowNull: true,
            constraints: false,
        });
        ProductSet.belongsTo(models.Store, {
            foreignKey: "store_id",
            allowNull: true,
            constraints: false,
            onDelete: "cascade",
        });


    };
    return ProductSet;
  };                    