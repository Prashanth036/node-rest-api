const isAuthenicatedMiddleware = require("../common/middlewares/isAuthenicatedMiddleware");
const PostController = require("./PostController");

const router= require("express").Router();



router.post(
    "/create",
    [isAuthenicatedMiddleware.check],
    PostController.createPost
)

router.get(
    "/getPosts",
    [isAuthenicatedMiddleware.check],
    PostController.getAllPosts
)

router.get(
    "/getReactions",
    [isAuthenicatedMiddleware.check],
    PostController.getReactions
)



module.exports = router