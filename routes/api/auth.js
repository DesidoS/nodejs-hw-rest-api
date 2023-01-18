const express = require("express");

const { register, login, logout } = require("../../controllers");
const { tryCatchWrapper, validation, auth } = require("../../middlewares");

const { joiLoginSchema, joiRegisterSchema } = require("../../models/user");

const router = express.Router();

router.post(
  "/register",
  validation(joiRegisterSchema),
  tryCatchWrapper(register)
);
router.post("/login", validation(joiLoginSchema), tryCatchWrapper(login));
router.get("/logout", auth, tryCatchWrapper(logout));

module.exports = router;
