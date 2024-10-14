"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express from 'express';
// import session from 'express-session';
const passport_1 = __importDefault(require("passport"));
// const bodyParser = require('body-parser');
const passport_local_1 = require("passport-local");
// User database simulation
const users = [];
users.push({ username: 'test', password: '123' });
// Passport local strategy
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => {
    console.log('using local strategy');
    const user = users.find((user) => user.username === username);
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
}));
// Serialize and deserialize user
passport_1.default.serializeUser((user, done) => {
    console.log('seralizing user');
    done(null, user.username);
});
passport_1.default.deserializeUser((username, done) => {
    console.log('deseralizing user');
    const user = users.find((user) => user.username === username);
    done(null, user);
});
