const { register, login, logout } = require("./auth");
const {
  getCurrent,
  updateAvatar,
  verifyEmail,
  verifyEmailResending,
} = require("./user");
const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
  changeFavoriteContact,
} = require("./contacts");
const auth = require("./auth");

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
  changeFavoriteContact,
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
  verifyEmailResending,
};
