const User = require("./userModel");
const Role = require("./roleModel");
const bcript = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const secretKey = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

class Api {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      console.log('req.body', req.body)
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { firstname, lastname, email, username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует" });
      }
      const hashedPass = bcript.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const newUser = new User({
        firstname,
        lastname,
        email,
        username: username,
        password: hashedPass,
        roles: [userRole.value],
      });
      await newUser.save();
      console.log(`Пользователь с  данными ${newUser} `)
      return res
        .status(201)
        .json({ message: "Регистрация пройдена успешно" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "registration error" });
    }
  }

  async login(req, res) {
    try {
      console.log(req.body);
      const { username, password } = req.body;
      const loggedUser = await User.findOne({ username });
      if (!loggedUser) {
        return res
          .status(400)
          .json({ message:`Пользователь с таким  именем  не найден` });
      }
      const validPass = bcript.compareSync(password, loggedUser.password);
      if (!validPass) {
        return res.status(400).json({ message: `Указан неверный пароль` });
      }
      const {firstname, lastname, email, username:userName, roles:userRole, _id:loginUserId} = loggedUser
      const token = generateAccessToken(loggedUser._id, loggedUser.roles);
      //const userRole = loggedUser.roles
      return res.json( { firstname, lastname, email, userName, loginUserId, token, userRole }), console.log(`Пользователь  ${userName} вошел в систему`), console.log(userName, userRole);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "login error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new Api();
