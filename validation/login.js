const Validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateregisterInput(data){
    let errors = {};
    
    const email = !isEmpty(data.email) ? data.email : '';
    const password = !isEmpty(data.password) ? data.password : '';
    
    if(!Validator.isEmail(email)){
        errors.email = 'Incorrect email';
    }

    if(Validator.isEmpty(email)){
        errors.email = 'Email is required';
    }

    if(!Validator.isLength(password, {min: 6, max: 40})){
        errors.password = 'Password must be between 6 and 40 characters';
    }

    if(Validator.isEmpty(password)){
        errors.password = 'Password is required';
    }

    return{
        errors,
        isValid: isEmpty(errors)
    }
}