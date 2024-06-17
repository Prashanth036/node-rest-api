const router= require("express").Router();


const AuthorizationController= require('./controllers/AuthorizationController');
const UserController=require("../users/UserController");

const SchemaValidationMiddleware = require('../common/middlewares/schemaValidationMiddleware')

const registerPayload = require("./schemas/registerPayload");
const loginpayload = require("./schemas/loginpayload");


router.post(
    "/signup",
    [SchemaValidationMiddleware.verify(registerPayload)],
    AuthorizationController.register
);

router.post(
    "/login",
    [SchemaValidationMiddleware.verify(loginpayload)],
    AuthorizationController.login
)

router.get(
    "/getAllUsers",UserController.getAllUsers
)

router.post(
    "/user",UserController.getUser
)

module.exports = router