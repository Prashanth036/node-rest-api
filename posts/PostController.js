const PostModel=require('../common/models/Posts');
const ReactionsModel=require('../common/models/Reactions')


module.exports={
  msg:"",
  sentNotifs:(io,socket,notifis)=>{
    if(this.msg!==undefined){
       notifis.push(this.msg);
       console.log(notifis);
       this.msg=undefined
    }
    io.emit("welMsgs",notifis);
  },
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
    getPostsByUser:(req,res)=>{
        const {user:{username}}=req; 
        const data=req.body;
        PostModel.getPostsByUsername({username:username})
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
        .then(async data=>{
            let reactionData=await ReactionsModel.reactionAdded({postId:data.id})
            .then((dataEmotes)=> dataEmotes).catch((err)=>console.log(err))
        
        data.dataValues.reaction=reactionData;
        console.log(data)
        this.msg=`${username} posted:${data.dataValues.title} #check it out`;
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
    },
    deletePost:(req,res)=>{
        const {
            params:{postId}
        }=req

        PostModel.deletePost({id:postId})
        .then(deletedPost=>{
            return res.status(200).json({
                status: true,
                data: {
                    MESSAGE:'SUCCESS',
                  deletedPost: deletedPost
                },
              });
            })
            .catch((err) => {
              return res.status(500).json({
                status: false,
                error: err,
              });})
    },
    updatePost:(req,res)=>{
        const {user:{username}}=req;

     const {   params:{postId},
        body: payload,
      } = req;
  
      
      if (!Object.keys(payload).length) {
        return res.status(400).json({
          status: false,
          error: {
            message: "Body is empty, hence can not update the user.",
          },
        });
      }

      PostModel.updatePost({id:postId},payload)
      .then(() => {
        return PostModel.findPost({id:postId });
      })
      .then((post) => {
        return res.status(200).json({
          status: true,
          data: post.toJSON(),
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
    }

}