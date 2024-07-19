const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const UserModel = require("../../common/models/User");
const  io  = require("../../app");

const { roles, jwtSecret, jwtExpireInSeconds } = require('../../config');
const { error } = require('console');

const generateAccessToken = (username, userId) => {
    return jwt.sign(
        {
            userId, username
        },
        jwtSecret,
        {
            expiresIn: jwtExpireInSeconds
        }
    )
}




const encryptedPassword = (password) => {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest('hex')
}

module.exports = {
    msg:"",
    name:"",
    setMailNotif:(io,socket,notifis)=>{
        // io.on("connection", (socket) => {
            const emitMsgs=[];
   
            if(this.name!==undefined){
                notifis.push(this.name);
            this.name=undefined
            }
            io.emit("welMsgs",this.notifis);
            socket.emit("welMsg", this.msg);
        
        // });
    },
    register: (req, res) => {
        const payload = req.body;

        let encrptedPassword = encryptedPassword(payload.password);
        let role = payload.role;
        if (!role) {
            role = roles.USER;
        }

        UserModel.createUser(
            Object.assign(payload, { password: encrptedPassword, role })
        )
            .then((user) => {
                const accessToken = generateAccessToken(payload.username, user.id);

                const welMsg = `Welcome to Blog ${payload.username} – where you can create, explore, and react to posts with ease. Connect and chat with others in our vibrant community!`
                // io.on("connection", (socket) => {
                //     console.log("user",socket.id)
                //     socket.emit("welMsg", welMsg);
                // });
                this.msg=welMsg;
                console.log("is it working or n ont")
                console.log("this aint working?",this.msg);
                this.name=`A new User ${payload.username} joined the app`
                return res.status(200).json({
                    status: true,
                    data: {
                        user: user.toJSON(),
                        token: accessToken
                    }
                })
            })
            .catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: err
                })
            })

    },
    login: (req, res) => {
        const { email, password } = req.body;

        UserModel.findUser({ email })
            .then((user) => {
                if (!user) {
                    return res.status(400).json({
                        status: false,
                        error: {
                            message: `Could not find any user with email: \`${email}\`.`,
                        }
                    })
                }

                const encryptedPass = encryptedPassword(password);

                if (user.password !== encryptedPass) {
                    return res.status(400).json({
                        status: false,
                        error: {
                            message: `Provided email and password did not match.`
                        }
                    })
                }

                const token = generateAccessToken(user.username, user.id);
                const welMsg = `Welcome Back Again ${user.username} to Blog – where you can create, explore, and react to posts with ease. Connect and chat with others in our vibrant community!`    
                this.msg=welMsg;
                console.log("is it working or n ont")
                console.log("this aint working?",this.msg);
                // io.on("connection",(sckt)=>{
                //     console.log("user:",sckt.id)
                //     io.emit("welMsg", welMsg)});
                // server.listen(3000)
                //  io.emitMsgs(welMsg);
                // console.log("yes it is ",io);
                return res.status(200).json({
                    status: true,
                    token: token
                })
            }).catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: `${err}4wsgvweg`
                })
            })
    }
}