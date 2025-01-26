const jwt = require('jsonwebtoken');
const User = require('../Models/UserModels');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorizeAsAuthor = async (req, res, next) => {
    if (req.user && req.user.role === 'author') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an author' });
    }
};

module.exports = { protect, authorizeAsAuthor };
