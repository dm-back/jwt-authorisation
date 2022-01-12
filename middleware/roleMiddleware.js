const jwt = require("jsonwebtoken");
const secretKey = require("../config");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "Пользователь не авторизован" });
      }
      const { roles: userRoles } = jwt.verify(token, secretKey);
      let hasRole = false;
      userRoles.forEach((element) => {
        if (roles.includes(element)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: "Доступ запрещен" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
  };
};
