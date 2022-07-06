const User = require('../models/userModel')
const createError = require('http-errors')
const bcrypt = require('bcrypt')

const listAllUsers = async (req,res) => {
    const allUsers = await User.find({})
    res.json(allUsers)
}

const loginUserInfos = (req, res, next) => {
    res.json(req.user)
}

const loginUserUpdate = async (req, res, next) => {
    delete req.body.createdAt
    delete req.body.updatedAt

    if(req.body.hasOwnProperty('password')) {
        req.body.password = await bcrypt.hash(req.body.password, 10)
    }

    const validation = User.joiValidationForUpdate(req.body)
    if(validation.error) {
        next(createError(400, validation.error))
    }else {
        try {
            const result = await User.findByIdAndUpdate({_id: req.user._id}, req.body, {new:true, runValidators:true})
            if(result) {
                return res.json(result)
            }else {
                throw createError(404, 'User not found.')
            }
        }catch(err) {
            next(createError(400, err))
        }
    }
}

const createNewUser = async (req, res, next) => {

    try {
        const newUser = new User(req.body)
        newUser.password = await bcrypt.hash(newUser.password, 10)
        const validation = newUser.joiValidation(req.body)
        if(validation.error) {
            next(createError(404, validation.error))
        }else {
            const result = await newUser.save()
            console.log(result)
            res.json(result)
        }
    }catch(err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const user = await User.login(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.json({
            user,
            token
        })
    }catch(err) {
        next(err)
    }
}

const adminUserUpdate = async (req, res, next) => {
    
    delete req.body.createdAt
    delete req.body.updatedAt

    if(req.body.hasOwnProperty('password')) {
        req.body.password = await bcrypt.hash(req.body.password, 10)
    }

    const validation = User.joiValidationForUpdate(req.body)
    if(validation.error) {
        next(createError(400, validation.error))
    }else {
        try {
            const result = await User.findByIdAndUpdate({_id: req.params.id}, req.body, {new:true, runValidators:true})
            if(result) {
                return res.json(result)
            }else {
                throw createError(404, 'User not found.')
            }
        }catch(err) {
            next(createError(400, err))
        }
    }
}

const adminDeleteAll = async (req, res, next) => {

    try {
        const result = await User.deleteMany({isAdmin: false})
        if(result) {
            return res.json({message: "All users are deleted"})
        }else {
            throw createError(404, 'User not found.')
        }
    }catch(err) {
        next(createError(400, err))
    }
    
}

const userDelete = async (req, res, next) => {

    try {
        const result = await User.findByIdAndDelete({_id: req.user._id})
        if(result) {
            return res.json({message: "User deleted"})
        }else {
            throw createError(404, 'User not found.')
        }
    }catch(err) {
        next(createError(400, err))
    }
    
}

const adminDeleteById = async (req, res, next) => {

    try {
        const result = await User.findByIdAndDelete({_id: req.params.id})
        if(result) {
            return res.json({message: "User deleted"})
        }else {
            throw createError(404, 'User not found.')
        }
    }catch(err) {
        next(createError(400, err))
    }
    
}

module.exports = {
    listAllUsers,
    loginUserInfos,
    loginUserUpdate,
    createNewUser,
    login,
    adminUserUpdate,
    adminDeleteAll,
    userDelete,
    adminDeleteById
}