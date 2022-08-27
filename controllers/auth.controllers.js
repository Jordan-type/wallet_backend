const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// models, modules, middlewares, services etc.
const User = require('../models/users.model');
const mg = require('../services/mailgun-services');
const { encrypt, decrypt } = require('../services/encryption-services');
const { createCeloWallet } = require('../services/wallets-gen-services');


// @route   POST api/auth
// @desc    Register user
// @access  Public
exports.signup = async (req, res, next) => {
    const { email, firstName, lastName, username, password, phoneNumber } = req.body;
    const userWallet = await createCeloWallet();

    // encrypt the private Key
    const encryptedPrivateKey = encrypt(userWallet.privateKey);

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({
            error: `User with this Email ${email} already exists.`
        });
    }

    try {
        // garvatar for providing a unique image for each user
        const image_url = `https://api.adorable.io/avatars/285/${username}.png`;

        // expiresIn: '120' // it will expire in 9 minutes
        // holds the user data
        const token = jwt.sign({ email, firstName, lastName, username, phoneNumber, image_url, password, walletAddress: userWallet.address, privateKey: encryptedPrivateKey }, process.env.JWT_SECRET, { expiresIn: '9m' });
        
        // send the email
        await mg.sendEmail(email, 'account-activation-link', process.env.CLIENT_URL, token);

        return res.status(200).json({
            message: `An activation link has been sent to your ${email}`
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            error: error.message 
        }); 
    }
};


// account activation with email
// @route  POST api/auth/account-activation
// @desc   Activate user account
// @access Public
exports.accountActivation = async (req, res, next) => {
    const { token } = req.body;
    try {
        if (token) {
            // verify the token
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({ 
                        err: 'Expired link. Signup again'
                    });
                }

                // if everything is good, save to request for use in other routes
                // decode the token and get the user id and email
                const { email, firstName, lastName, username, image_url, password, phoneNumber, walletAddress, privateKey } = decodedToken;
                console.log(decodedToken)

                User.findOne({ email }).exec((err, user) => {
                    if(user) {
                        return res.status(400).json({ 
                            err: 'User already exists'
                        });
                    }
                    const newUser = new User({ email, firstName, lastName, username, image_url, password, phoneNumber, walletAddress, privateKey, isEmailVerified: true, resetVerified: false });
                    
                    newUser.save((err, user) => {
                        if(err) {
                            return res.status(400).json({ 
                                error: err
                            });
                        }
                        user.salt = undefined;
                        user.hash_password = undefined;

                        res.status(200).json({ 
                            data: user, 
                            message: 'successfully registered'});
                    });
                });
            });
        } else {
            return res.status(401).json({
                error: 'No token provided'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            error: error.message 
        });
    }
};

// @route   POST api/auth/login
// @desc    Login user and return JWT token
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            error: `User with this Email ${email} does not exist.`
        });
    }

    // check if password is correct
    if (!user.authenticate(password)) {
        return res.status(400).json({
            error: `Password is incorrect.`
        });
    }

    // if everything is good, save to request for use in other routes
    // decode the token and get the user id and email
    const { _id, firstName, lastName, username, image_url, isEmailVerified, resetVerified } = user;
    console.log(user.username);
    const token = jwt.sign({ _id, firstName, lastName, username, image_url, isEmailVerified, resetVerified }, process.env.JWT_SECRET, { expiresIn: '9m' });

    return res.status(200).json({
        message: `Welcome ${username}`,
        token
    });
};

// @route  POST api/auth/logout
// @desc   Logout user
// @access Public
exports.logout = async (req, res, next) => {
    try {
        res.status(200).json({
            message: 'Successfully logged out'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
};

// @route  POST api/auth/reset-password
// @desc   Reset user password
// @access Public
exports.resetPasswordLink = async (req, res, next) => {
    const { email } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            error: `User with this Email ${email} does not exist.`
        });
    }

    // if everything is good, save to request for use in other routes
    // decode the token and get the user id and email
    const { _id, username, image_url, isEmailVerified, resetVerified } = user;
    const token = jwt.sign({ _id, username, image_url, isEmailVerified, resetVerified }, process.env.JWT_SECRET, { expiresIn: '9m' });

    // send the email
    await mg.sendEmail(email, 'reset-password-link', process.env.CLIENT_URL, token, );

    return res.status(200).json({
        message: `An reset password link has been sent to ${email}`
    });  
};

// @route  POST api/auth/reset-password
// @desc   Reset user password
// @access Public
exports.resetPassword = async (req, res, next) => {
    const { token, password } = req.body;
    try {
        if (token) {
            // verify the token
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    return res.status(401).json({
                        err: 'Expired link!'
                    });
                }

                // if everything is good, save to request for use in other routes
                // decode the token and get the user id and email
                const { _id, username, image_url, isEmailVerified, resetVerified } = decodedToken;
                const newUser = new User({ _id, username, image_url, isEmailVerified, resetVerified, password });

                newUser.hash_password = await bcrypt.hash(password, 10);
                newUser.salt = undefined;
                newUser.resetVerified = true;
                
                newUser.save((err, user) => {
                    if(err) {
                        return res.status(400).json({
                            error: err
                        });
                    }
                    user.salt = undefined;
                    user.hash_password = undefined;

                    res.status(200).json({
                        data: user,
                        message: 'successfully registered'
                    });

                });
            });
        } else {
            return res.status(401).json({
                error: 'No token provided'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
};