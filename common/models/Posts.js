const { DataTypes } = require('sequelize');
const Reactions = require("./Reactions")


const PostModel = {
  /*   id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, */
  id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true

    } ,
    
    title: {
        type: DataTypes.STRING,
        autoNull: false,
        // unique: true
    },
    username: {
        type: DataTypes.STRING,
        autoNull: false,
        // unique: true
    },
    content: {
        type: DataTypes.STRING,
        autoNull: false,
        // unique: true
    }
}

module.exports = {

    initialise:  (sequelize) => {
      return  this.model =  sequelize.define("post", PostModel, {
        underscored: true
      });
    },
    forPostRelations: (Reaction) => {
        // console.log(Reaction);
        this.model.hasOne(Reaction,
            // {foreignKey: 'postCode', sourceKey: 'post_id'}
             );
             this.reaction=Reaction;
        // return this.model
    },
    createPost: (post) => {
        // const Reaction = Reactions.forRelations();
        // console.log(Reaction)
        // this.model.hasMany(Reactions.forRelations(), { foreignKey: 'post_id' });
        return this.model.create(post);
    },
    getAllPosts: () => {
        return this.model.findAll({include: this.reaction});
    },
    getPostsByUsername:(query) =>{
        return this.model.findAll({where:query,include: this.reaction})
    },
    findPost: (query) => {
        return this.model.findOne({
          where: query,include: this.reaction
        });
      },
    updatePost: (query, updateValue) => {
        return this.model.update(updateValue, {
            where: query
        })
    },
    deletePost: (query) => {
        return this.model.destroy({
            where: query
        })
    },
}

