const { error } = require('ajv/dist/vocabularies/applicator/dependencies');
const PostModel = require('../common/models/Posts');
const ReactionsModel = require('../common/models/Reactions')

module.exports = {

    updateReactions: (req, res) => {
        // console.log(req);
        const { user: { userId },
            body: payload } = req;
            // console.log(payload)
        if (!Object.keys(payload).length) {
            return res.status(400).json({
                status: false,
                error: {
                    message: "Body is empty, hence can not update the user.",
                },
            });
        }
        ReactionsModel.updateReactions(payload)
            .then(() => {
             return   ReactionsModel.getAllReactionsById(payload.postId)
                    
            }).then((data) => {
                if (!data) {
                    return res.status(400).json({
                        status: false,
                        error: {
                            message: 'Cant find postId'
                        }
                    })
                }
                return res.status(200).json({
                    status: true,
                    data: data
                })
            })
            .catch(err=>{
              return res.status(500).json({
                staus: false,
                error: err
            })
            })
    }
}