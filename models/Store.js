module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define(
      "Store",
      {
        storeName: {
          field: 'storeName',
          type: DataTypes.STRING(50),
          comment: "가게이름",
          allowNULL:false
        },
        storeAddress: {
          field: 'storeAddress',
          type: DataTypes.STRING(60),
          comment: "가게 주소",
          allowNULL:false
        },
        tel: {
          field: 'tel',
          type: DataTypes.STRING(20),
          comment: "전화번호",
          allowNULL:false
        },
        representativeName: {
          field: 'representativeName',
          type: DataTypes.STRING(30),
          comment: "대표자 이름",
          allowNULL:false
        },
        businessNum: {
          field: 'businessNum',
          type: DataTypes.STRING(30),
          comment: "사업자번호",
          allowNULL:false
        },
        isOpen: {
          field: 'isOpen',
          type: DataTypes.INTEGER,
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
    };
    return Store;
  };