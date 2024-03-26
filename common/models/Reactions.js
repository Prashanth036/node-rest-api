const { DataTypes } = require('sequelize');
const PostModel = require("./Posts")


const ReactionsModel = {
   /*  postCode: {
        // allowNull: false,
        type: DataTypes.INTEGER,
        // autoIncrement: true,
        // primaryKey: true
    },  */
    /*    references: {
         model: 'posts',
         key: 'post_id'
       } */

    thumbsUp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    hooray: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    heart: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rocket: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    eyes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}

module.exports = {
    initialise:  (sequelize) => {
        return this.model =  sequelize.define("reaction", ReactionsModel, {
            underscored: true
          });
        // console.log(Post)
        // const Reaction=this.model;
        // const Post = PostModel.initialise();

        //    return this.model
    },
    forRelations: (Post) => {
        // console.log(Post)
        this.model.belongsTo(Post
            // ,{foreignKey: 'postCode', targetKey: 'post_id'}
            );
        // const Reaction=this.model;
        // const Post = PostModel.forRelations();
        // this.model.belongsTo(Post);
        // 
        // return Post
    },
    reactionAdded: (query) => {
        return this.model.create(query);
    },
    updateReactions: (query) => {
        // console.log(query)
        return this.model.update(
            query,
            {
                where: {postId:query.postId},
            }
        )
    },
    getAllReactionsById: (query) => {
        console.log(query)
        return this.model.findOne({
            where:query
        })
    }
}