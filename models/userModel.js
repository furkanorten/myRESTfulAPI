const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('@hapi/joi')
const createError = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {collection: 'users', timestamps:true})

const schema = Joi.object({
    name: Joi.string().min(3).max(50).trim(),
    userName: Joi.string().min(3).max(50).trim(),
    email: Joi.string().trim().email(),
    password: Joi.string().min(6).trim()
})

// validation for new user
UserSchema.methods.joiValidation = function(userObject) {
    schema.required()
    return schema.validate(userObject)
}

UserSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user._id
    delete user.password
    delete user.createdAt
    delete user.updatedAt
    delete user.__v

    return user
}

UserSchema.statics.login = async (email, password) => {
    
    const validation = schema.validate({email, password})
    if(validation.error) {
        throw createError(400, validation.error)
    }
    
    const user = await User.findOne({email})
    if(!user) {
        throw createError(400, 'Incorrect email/password')
    }
    const passwordControl = await bcrypt.compare(password, user.password)
    if(!passwordControl) {
        throw createError(400, 'Incorrect email/password')
    }
    return user 
}   

UserSchema.methods.generateToken = async function () {
    const user = this
    const token = await jwt.sign({_id:user._id, email:user.email}, 'secretkey', {expiresIn: '1h'})
    return token
}

// validation for user update
UserSchema.statics.joiValidationForUpdate = function(userObject) {
    return schema.validate(userObject)
}

const User = mongoose.model('User', UserSchema)

module.exports = User