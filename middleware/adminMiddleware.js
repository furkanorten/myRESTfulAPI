const admin = (req, res, next) => {
    if(!req.user.isAdmin) {
        return res.status(403).json({
            message: 'You are not an admin.'
        })
    }
    next()
}

module.exports = admin