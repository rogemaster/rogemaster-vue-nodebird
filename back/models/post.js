module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { // 대문자로 써야 함. User -> 테이블에는 users로 등록됨
        content: {
            type: DataTypes.TEXT,
            allowNull: false,   // 필수 not Null
        },
        
    }, {
        charset: 'utf8mb4', // mb4 -> 이미티콘떄문에 사용
        collate: 'utf8mb4_general_ci', // 한글 저장을 위한
    });
    
    // 테이블 모델들간의 관계작성
    Post.associate = (db) => {
        db.Post.belongsTo(db.User); // belongsTo -> UserId 도 저장됨(사용자 ID)
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
        db.Post.belongsTo(db.Post, { as: 'Retweet' });
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    };
    return Post;
}