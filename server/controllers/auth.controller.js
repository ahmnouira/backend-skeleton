import User from '../models/user.model';
import config from '../../config/config';
import expressJwt from 'express-jwt'; // is a middleware that validates JSON Web Tokens 
import jwt from 'jsonwebtoken';

const signin = (req, res) => {

    User.findOne({
        "email": req.body.email
    }, (err, user) => {
        // user not found
        if (err || !user)
            return res.status(401).json({
                error: "User not found"
            });


        // !!!!!!!!!!!!
        if (!user.authenticate(req.body.password)) {
            return res.status(401).json({
                error: "Email and password don't math."
            });
        }

        const token = jwt.sign({
            _id: user._id
        }, config.jwtSecret)

        res.cookie("t", token, {
            expire: new Date() + 9999
        });

        return res.json({
            token,
            user: {
                _id: user._id, name: user.name, email: user.email
            }
        });
    });

}

const signout = (req, res) => {

    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    });
}


// to verifty that the incoming request has a valid JWT in the Authorization header
// if the token is valid it appends the verifed user's ID in an 'auth' key to the request Obejct 
const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth'
});
const hasAuthorization = (req, res, next) => {

    const authorized = req.profile && req.auth && req.prfile._id === req.auth._id;

    if (!(authorized)) {
        return res.status(403).json({
            error: "User is not authorizd"
        });
    }

    next();

}


export default { signin, signout, requireSignin, hasAuthorization }
