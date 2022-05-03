module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    
    // 테이블 모델들간의 관계작성
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };
    return Comment;
}