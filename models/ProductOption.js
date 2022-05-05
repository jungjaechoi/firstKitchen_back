module.exports = (sequelize, DataTypes) => {
    const ProductOption = sequelize.define("ProductOption", {
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
<<<<<<< HEAD
      sequelize,
=======
>>>>>>> 75eab397aea4dbbe0779a4cf47ee093f5fb56ff9
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    });
    ProductOption.associate = (models) => {
        ProductOption.hasMany(models.Order, {
            foreignKey: "productOption_id",
            allowNull: true,
            constraints: false,
        });
        ProductOption.belongsTo(models.Store, {
            foreignKey: "store_id",
            allowNull: true,
            constraints: false,
            onDelete: "cascade",
        });


    };
    return ProductOption;
  };                    