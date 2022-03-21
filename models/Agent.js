module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define("Agent", {
    // id, createdAt, updatedAt 자동 생성
    tel: {
      type: DataTypes.STRING(100),
      comment: "전화번호"
    },
    storeAnalyzingPw: {
      type: DataTypes.STRING(60),
      comment: "비밀번호"
    }
    // 위치 정보 needs to be added
  });
  Agent.associate = (models) => {
    Agent.hasMany(models.Store, {
      foreignKey: "agent_id",
      allowNull: true,
      constraints: false,
    });
  };
  return Agent;
};