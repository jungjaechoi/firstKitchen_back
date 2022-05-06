module.exports = (sequelize, DataTypes) => {
    const Delivery = sequelize.define("Delivery", {
      // id, createdAt, updatedAt 자동 생성
      store_id:{
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      user_id:{
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      user_nickname:{
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      deliveryApp: {
        type: DataTypes.STRING(20),
        comment: "배달앱종류",
        allowNULL:false
      },
      receptionType: {
        type: DataTypes.STRING(15),
        comment: "주문타입",
        allowNULL:false
      },
      // 주문타입(DELIVERY=배달, PICKUP=픽업)
      orederTime: {
        type: DataTypes.STRING(15),
        comment: "주문시간",
        allowNULL:false
      },
      jibunAddress: {
        type: DataTypes.STRING(30),
        comment: "지번 주소"
      },
      roadAddress: {
        type: DataTypes.STRING(30),
        comment: "도로명주소"
      },
      addressDetail: {
        type: DataTypes.STRING(30),
        comment: "배달 상세 주소",
        allowNULL:false
      },
      memo: {
        type: DataTypes.STRING(200),
        comment: "주문 요청 사항"
      },
      request: {
        type: DataTypes.STRING(200),
        comment: "배달 요청 사항"
      },
      tel: {
        type: DataTypes.STRING(20),
        comment: "주문자 전화번호",
        allowNULL:false
      },
      payType: {
        type: DataTypes.INTEGER(5),
        comment: "결제 방법",
        allowNULL:false
      },
      // 결제방법 (1=결제완료, 2=만나서 카드결제, 3=만나서현금결제)
      totalPaidPrice: {
        type: DataTypes.INTEGER(10),
        comment: "실 결제금액",
        allowNULL:false
      },
      // 실 결제금액(주문금액 - 할인금액 + 배달료)
      totalPrice: {
        type: DataTypes.INTEGER(10),
        comment: "주문금액",
        allowNULL:false
      },
      discountPrice: {
        type: DataTypes.INTEGER(10),
        comment: "할인금액",
        allowNULL:false
      },
      deliveryPrice: {
        type: DataTypes.INTEGER(10),
        comment: "배달료",
        allowNULL:false
      },
      status: {
        type: DataTypes.INTEGER(5),
        comment: "조리상태",
        defaultValue: 0
      },
       // 0=대기, 1=접수, 2=완료(라이더한테 전달 or 포장), 3=완료(home 화면에서 안보임), 4=환불(paymenthistory에서 보임), 5=환불(paymenthistory 에서 안보임)
    },
    {
      timestamps: true,
      charset: "utf8",
      collate: "utf8_general_ci",
    });
    Delivery.associate = (models) => {
      Delivery.hasMany(models.Order, {
        foreignKey: "delivery_id",
        allowNull: true,
        constraints: false,
      });
      Delivery.belongsTo(models.Store, {
        foreignKey: "store_id",
        allowNull: true,
        constraints: false,
        onDelete: "cascade",
      });
    };
    return Delivery;
  };