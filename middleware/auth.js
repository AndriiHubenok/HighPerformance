const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super_secret_key'; // Should be stored securely in environment variables in production

// N_FR1: Secure authentication and authorization
// Check if the user is authenticated (Authorization)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(cleanToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

// Check if the user has the required role (Authorization)
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Insufficient rights" });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole, JWT_SECRET };