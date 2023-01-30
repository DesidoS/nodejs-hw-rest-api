require("dotenv").config();
const nodemailer = require("nodemailer");

const { META_PASSWORD } = process.env;
const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "desidos@meta.ua",
    pass: process.env.META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmailNodemailer = async (data) => {
  const email = { ...data, from: "desidos@meta.ua" };
  try {
    await transporter.sendMail(email);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmailNodemailer;
