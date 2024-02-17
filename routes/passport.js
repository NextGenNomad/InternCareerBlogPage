const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User'); // rectreve users form database 'use model'

function initializePassport(passport, getUserByUsername) {
    const authenticationUser = async (username, password, done) => {
        try {
            const user = await getUserByUsername(username);
            if (!user) {
                return done(null, false, { message: 'No user with that username' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (err) {
            return done(err);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticationUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
}

module.exports = initializePassport;
