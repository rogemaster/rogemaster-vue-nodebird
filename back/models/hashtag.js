module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', {
        src: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    
    // 테이블 모델들간의 관계작성
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    };
    return Hashtag;
}