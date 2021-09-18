const jwt = require('jsonwebtoken');
const {model: UserModel} = require('../models/user');

//TODO PROBABLY USE IN DB TOKEN
/**
 * @param {function(loggedUser): Promise<boolean> | function(loggedUser): boolean} [verifyUserFn]
 * @returns {function(*, *, *): Promise<*>}
 */
function checkAuth(verifyUserFn) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const {userId} = await jwt.verify(token, "secret_this_should_be_longer");
      const user = await UserModel.findOne({_id: userId});
      if (!user) {
        return res.status(401).json({message: 'Unauthorized'});
      }

      req.user = user;
      if (verifyUserFn) {
        const allow = await verifyUserFn(user);
        if (!allow) {
          return res.status(401).json({message: 'Unauthorized'});
        }
      }

      next();
    } catch (error) {
      res.status(401).json({message: "Unauthorized"});
    }
  };
}

module.exports = checkAuth;
