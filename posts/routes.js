const isAuthenicatedMiddleware = require("../common/middlewares/isAuthenicatedMiddleware");
const PostController = require("./PostController");
const ReactionController=require("./ReactionsController");

const router= require("express").Router();



router.post(
    "/create",
    [isAuthenicatedMiddleware.check],
    PostController.createPost
)

router.get(
    "/getPosts",
    // [isAuthenicatedMiddleware.check],
    PostController.getAllPosts
)

router.get(
    "/getPostsByUser",
    [isAuthenicatedMiddleware.check],
    PostController.getPostsByUser
)

router.delete("/delete/:postId",
        [isAuthenicatedMiddleware.check],
        PostController.deletePost              
);

router.patch("/update/:postId",
           [isAuthenicatedMiddleware.check],
           PostController.updatePost
)

router.get(
    "/getReactions",
    [isAuthenicatedMiddleware.check],
    PostController.getReactions
)

router.post(
    "/updateReactions",
    [isAuthenicatedMiddleware.check],
    ReactionController.updateReactions
)





module.exports = router