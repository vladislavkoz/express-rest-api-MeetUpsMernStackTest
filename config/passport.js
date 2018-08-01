const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Guest = require('../models/Guest');
const keys = require('../config/keys');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.SecretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload,done) =>{
        Guest.findById(jwt_payload.id)
            .then(user => {
                if(user){
                    return done(null, user);
                }
                return done(null,false);
            })
            .catch(err => console.error(err))
    }))
};