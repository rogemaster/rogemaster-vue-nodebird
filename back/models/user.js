module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,   // 필수 not Null
            unique: true,   // 중복 금지
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false,   // 필수 not Null
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,   // 필수 not Null
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 저장을 위한
    });
    
    User.associate = (db) => {

    };
    return User;
}