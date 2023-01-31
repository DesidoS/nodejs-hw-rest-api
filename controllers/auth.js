const { User } = require("../models/user");
const { Conflict, Unauthorized } = require("http-errors");
const { SECRET_KEY } = process.env;
const sendMail = require("../helpers/sendEmail");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`User with ${email} already exists`);
  }
  const avatarURL = gravatar.url(email);
  const hashedPassword = await bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(10)
  );
  const verificationToken = Date.now();
  const mail = {
    to: email,
    subject: "Verification email",
    html: `<a target="_blank" href="http://localhost:8080/api/users/verify/${verificationToken}">Hi ${name}.Follow this link, for verification </a>`,
  };

  sendMail(mail);

  const result = await User.create({
    name,
    email,
    password: hashedPassword,
    avatarURL,
    // verificationToken,
  });
  res.status(201).json(result);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passCompare = bcrypt.compareSync(password, user.password);
  if (!user) {
    throw new Unauthorized(`User with ${email} not found`);
  }
  if (!passCompare) {
    throw new Unauthorized("Password is incorrect");
  }
  if (!user.verify) {
    throw new Unauthorized(`User not verify`);
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

module.exports = {
  register,
  login,
  logout,
};
