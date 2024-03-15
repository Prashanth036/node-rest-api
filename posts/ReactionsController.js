const PostModel=require('../common/models/Posts');
const ReactionsModel=require('../common/models/Reactions')

module.exports={
   
    createPost:(req,res)=>{
        const {user:{username}}=req;
        const data=req.body;
        PostModel.hasMany(ReactionsModel.forRelations);
        PostModel.createPost(
            Object.assign(
            data
            ,{username:username}
            )
            )
        .then(data=>{
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
    }
}