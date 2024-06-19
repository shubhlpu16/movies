const Users = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router= new express.Router()


const jwtMiddleware = async (req, res, next) => {
    req.token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    next();
}

router.post('/signup', jwtMiddleware,async (req, res) => {
    const user = new Users({...req.body});
    try {
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'secretKey');
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
});



router.post('/login',jwtMiddleware, async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password);
     
        const token = jwt.sign({ userId: user._id }, 'secretKey');
        res.send({ user, token });
    } catch (e) {
        res.status(404).send(e);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
