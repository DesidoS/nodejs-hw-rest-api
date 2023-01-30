const sendMail = require("../helpers/sendEmail");
const { User } = require("../models/user");
const { NotFound, BadRequest } = require("http-errors");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new NotFound();
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({ message: "Verifu success" });
};

const verifyEmailResending = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFound();
  }
  if (user.verify) {
    throw new BadRequest("Verification has already been passed");
  }
  const mail = {
    to: email,
    subject: "Verification email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Follow this link, for verification </a>`,
  };

  sendMail(mail);
  res.json({ message: "Check youre email" });
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.json({
    name,
    email,
  });
};

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;
  try {
    const resultUpload = path.join(avatarsDir, imageName);
    const result = await fs.rename(tempUpload, resultUpload);
    const rowAvatarURL = path.join("public", "avatars", imageName);
    const resizeImage = Jimp.read(rowAvatarURL);

    const font = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);

    (await resizeImage)
      .resize(250, 250)
      .print(font, 10, 10, "I <3 NODEJS")
      .write(`public/avatars/250-${imageName}`);

    const avatarURL = `public/avatars/250-${imageName}`;
    await User.findByIdAndUpdate(req.user._id, {
      avatarURL,
    });
    res.json({ avatarURL });
    await fs.unlink(rowAvatarURL);
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

module.exports = {
  getCurrent,
  updateAvatar,
  verifyEmail,
  verifyEmailResending,
};
