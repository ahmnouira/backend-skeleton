import User from '../models/user.model';
import getErrorMessage from '../helpers/dbErrorHandler';
import _ from 'lodash';  // when updatin an exsting user with changed values

const userById = (req, res, next, id) => {

    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User Not Found'
            });
        }
        req.profile = user;
        next();
    });
}

// POST
const postOne = (req, res, next) => {

    const user = new User(req.body);

    user.save((err, result) => {

        if (err) {
            return res.status(400).json({
                error: getErrorMessage(err),
            });
        }

        res.status(200).json({
            message: "Successfully created new User"
        });
    });

}

// GET
const getAll = (req, res, next) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: getErrorMessage(err),
            });
        }
        console.log(users);
        res.json(users);
    }).select('name email created updated');
}

const deleteAll = (req, res, next) => {
    User.deleteMany((err) => {
        if (err) {
            return res.status(400).json({
                error: getErrorMessage(errr),
            });
        }
        res.json({
            ok: 'All Users Delated'
        })
    });
}

// GET user by id
const getOne = (req, res) => {
    req.profile.hashedPassword = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

const updateOne = (req, res) => {
    let user = req.profile;
    user = (user, req.body);
    user.updated = Date.now();
    user.save((err) => {
        if (err) {
            return res.status(400).json({
                error: getErrorMessage(err)
            });
        }
        user.hashedPassword = undefined;
        user.salt = undefined;
    });
}

const deleteOne = (req, res, next, userId) => {

    let user = req.profile;
    user.remove((err, deletedUser => {

        if (err) {
            return res.status(400).json({
                error: getErrorMessage(err)
            })

        } else {
            deletedUser.hashedPassword = undefined;
            deletedUser.salt = undefined;
            res.json(deletedUser);
        }

    }));



}


export default { postOne, getAll, deleteAll, getOne, updateOne, deleteOne, userById }




