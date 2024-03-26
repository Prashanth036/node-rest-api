const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const UserModel = require("../../common/models/User");


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