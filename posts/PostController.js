const PostModel=require('../common/models/Posts');
const ReactionsModel=require('../common/models/Reactions')


module.exports={
    getAllPosts:(req,res)=>{
        // PostModel.hasMany(ReactionsModel,{foreignKey: 'post_id'});
        // ReactionsModel.belongsTo(PostModel,{foreignKey: 'post_id'});
        PostModel.getAllPosts()
        .then((post)=>{
            return res.status(200).json({
                status:true,
                data: post
            })
        }).catch((err)=>{
            return res.status(500).json({
                status:false,
                error:{
                    message:err} 
            })})
    },
    createPost:(req,res)=>{
        const {user:{username}}=req;
        const data=req.body;
        // PostModel.forRelations.hasMany(ReactionsModel.forRelations,{foreignKey: 'post_id'});
        // ReactionsModel.forRelations.belongsTo(PostModel.forRelations,{foreignKey: 'post_id'});
        PostModel.createPost(
            Object.assign(
            data
            ,{username:username}
            )
            )
        .then(data=>{
        if(data){
            ReactionsModel.reactionAdded({postId:data.id})
            .then((data)=>console.log(data)).catch((err)=>console.log(err))
        } 
           return res.status(200).json({
            status:true,
            data:data
           })
        }).catch(err=>{
            return res.status(500).json({
                status:false,
                error:err
            })
        })
    },
    getReactions:(req,res)=>{
         ReactionsModel.getAllReactionsById()
         .then((data)=>{
            return res.status(200).json({
                status:true,
                data:data
            })
         })
    }

}