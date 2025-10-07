const jwt = require('jsonwebtoken');

function auth(req, res, next) {
     const header = req.header('Authorization');
     if (!header) return res.status(401).json({ msg: 'No token, authorization denied' });

     const token = header.replace('Bearer ', '');
     try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = decoded; // { id: ..., iat, exp }
     next();
     } catch (err) {
     return res.status(401).json({ msg: 'Token is not valid' });
     }
}

module.exports = auth;