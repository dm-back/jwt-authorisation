const Router = require("express");
const api = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const passLength = 6;
const router = new Router();

router.post(
  "/registration",
  [
    check("username", "задайте имя пользователя").notEmpty(),
    check(
      "password",
      `Пароль должен быть не короче ${passLength} символов`
    ).isLength({
      min: passLength,
    }),
  ],
  api.registration
);
router.post("/login", api.login);
router.get("/users", roleMiddleware(["USER", "ADMIN"]), api.getUsers);

module.exports = router;
