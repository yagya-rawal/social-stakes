const { decode } = require("jsonwebtoken");
const jwt = require("jsonwebtoken")
const User = require('./Models/user.model.js')

const verifyUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).json({ error: 'Token is missing' });
    }
    
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        console.log(token, decoded)
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      req.user = decoded;
      next();
    });
  };

  const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization;
  console.log(token)
    if (!token) {
      return res.status(403).json({ error: 'Token is missing' });
    }
  
    jwt.verify(token, process.env.PRIVATE_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      console.log(decoded)
      const userId = decoded.userId
      console.log(userId)
      const user = await User.findOne({'_id': userId})

      if(!user)
        res.status(500).send("cannot verify user as admin")
      
        console.log(user)
      if (!user.isAdmin) {
        return res.status(500).send("User not admin");
      }
  
      req.user = user;
      next();
    });
  };

module.exports = {
    verifyAdmin,
    verifyUser
}