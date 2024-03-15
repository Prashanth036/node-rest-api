const UserModel = require('../common/models/user');

module.exports = {
    getUser: (req, res) => {
        const {
            user: { userId }
        } = req;
        UserModel.findUser({ id: userId })
            .then((user) => {

                return res.status(200).json({
                    status: true,
                    data: user.toJSON()
                })
            }).catch((err) => {
                return res.status(500).json({
                    statys: false,
                    error: err
                })
            })
    },

    updateUser: (req, res) => {
        const { user: { userId },
            body: payload
        } = req;

        if (!Object.keys(payload).length) {
            return res.status(400).json({
                status: false,
                error: {
                    message: "Body is empty, hence can not update the user.",
                },
            });
        }

        UserModel.updateUser({ id: userId }, payload)
            .then(() => {
                return UserModel.findUser({ id: userId })
            }).then((user) => {
                return res.status(200).json({
                    status: true,
                    data: user.toJSON(),
                });
            })
            .catch((err) => {
                return res.status(500).json({
                    status: false,
                    error: err,
                });
            });
    },

    deleteUser: (req, res) => {

    },

    getAllUsers: (req, res) => {

    },
    changeRole: (req, res) => {

    }

}