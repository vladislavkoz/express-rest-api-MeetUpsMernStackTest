const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const Guest = require('../models/Guest')

router.get('/guests', function (req, res) {
    Guest.find()
        .then(guests => res.json(guests))
        .catch(err => res.status(500).json({error: err}))
});

router.get('/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json(
            {
                id: req.user.id,
                email: req.user.email
            }
        )
    });

router.post("/login", (req, res) => {

    const {errors, isValid} = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    Guest.findOne({email})
        .then(user => {
            if (!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors)
            } else {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            //User Mathced
                            const payload = {
                                id: user._id,
                                email: user.email
                            };

                            ////Sign Token
                            jwt.sign(
                                payload,
                                keys.SecretOrKey,
                                {expiresIn: 3600}, (err, token) => {
                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token
                                    })
                                })
                        } else {
                            errors.password = 'Incorect password'
                            return res.status(400).json(errors);
                        }
                    });
            }
        })
});

router.post('/registration', function (req, res) {
    const {errors, isValid} = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    Guest.findOne({email: req.body.email})
        .then(user => {
                if (user) {
                    errors.email = 'Email already exists'
                    return res.status(400).json(errors)
                }
                const newGuest = new Guest({
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newGuest.password, salt, (err, hash) => {
                        if (err) {
                            console.error(err)
                        } else {
                            newGuest.password = hash;
                            newGuest.save()
                                .then(guest => res.json(guest))
                                .catch(err => console.error(err))
                        }
                    })
                })
            }
        )
});

router.post('/guests', function (req, res) {
    Guest.create(req.body)
        .then(m => res.json(m))
        .catch(err => res.status(500).json({error: err}))
});

router.get('/guests/:id', function (req, res) {
    Guest.findById(req.params.id)
        .then(m => res.json(m))
        .catch(err => res.status(500).json({error: err}))
});

router.delete('/guests/:id', function (req, res) {
    Guest.findByIdAndRemove(req.params.id)
        .then(m => res.status(204).json('OK'))
        .catch(err => res.status(500).json({error: err}))
});

router.patch('/guests/:id', function (req, res) {
    Guest.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(m => res.json(m))
        .catch(err => res.status(500).json({error: err}))
});

module.exports = router;