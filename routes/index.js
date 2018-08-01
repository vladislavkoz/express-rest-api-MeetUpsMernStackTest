const express = require('express')
const router = express.Router();

const meetups = require('./meetups')
const guests = require('./guests')

router.use(meetups)
router.use(guests)

module.exports = router