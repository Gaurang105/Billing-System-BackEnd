const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const secret_key = process.env.MY_SECRET_KEY;

const hashedSHA256key = crypto.createHash('sha256').update(secret_key).digest('hex');


// Auth checking

function authenticateToken(req, res, next) {
   const token = req.cookies.token;
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, hashedSHA256key, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}


// isAdmin checking

function isAdmin(req, res, next) {
    const token = req.cookies.token;
    if (token == null) {
      return res.sendStatus(401);
    }
    jwt.verify(token, hashedSHA256key, (err, user) => {
      if (err || !user.isAdmin) {
        return res.sendstatus(403);
      }
      req.user = user;
      next();
    });
}

module.exports = {authenticateToken, isAdmin};
