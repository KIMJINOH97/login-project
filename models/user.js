module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',
        {
            email: {
                type: DataTypes.STRING(30),
                allowNull: false, // 필수
                unique: true, // 하나만
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: true, // 카카오톡 로그인 시 필요X
            },
            nick: {
                type: DataTypes.STRING(20),
                allowNull: false, // 필수
                unique: true, // 닉네임 하나만
            },
            age: {
                type: DataTypes.STRING(10),
                allowNull: false, // 필수
            },
            provider: {
                type: DataTypes.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
        },
        { timestamps: true, paranoid: true }
    );
};
