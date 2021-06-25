import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

/**
 * authentication & authorization is different
 * https://www.okta.com/identity-101/authentication-vs-authorization/
 *
 * Authentication confirms that users are who they say they are.
 * Authorization gives those users permission to access a resource.
 *
 *  */

/**
 * @desc Authenticate user & get token
 * @route POST /api/users/login
 * @access Public
 */
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // find the user matches with the email
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        const { _id, name, email, isAdmin } = user;
        res.json({
            _id,
            name,
            email,
            isAdmin,
            token: generateToken(_id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

/**
 * @desc Register a new user
 * @route POST /api/users
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // find the user matches with the email
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
        const { _id, name, email, isAdmin } = user;
        res.status(201).json({
            _id,
            name,
            email,
            isAdmin,
            token: generateToken(_id)
        }); //201 means something created
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

/**
 * @desc Get user profile
 * @route GET /api/users/profile
 * @access Public
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { _id, name, email, isAdmin } = user;
    if (user) {
        res.json({
            _id,
            name,
            email,
            isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc Update user profile
 * @route PUT /api/users/profile
 * @access Public
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();

        const { _id, name, email, isAdmin } = updatedUser;
        res.json({
            _id,
            name,
            email,
            isAdmin,
            token: generateToken(_id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}); // get all users
    res.json(users);
});

/**
 * @desc Delete user
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc Get user by ID
 * @route GET /api/users
 * @access Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc Update user
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin || user.isAdmin;
        const updatedUser = await user.save();

        const { _id, name, email, isAdmin } = updatedUser;
        res.json({
            _id,
            name,
            email,
            isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
};
