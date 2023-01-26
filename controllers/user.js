const { User } = require("../models/user");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const getCurrent = async (req, res) => {
  const { name, email } = req.user;
  res.json(req.user, { name, email });
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
};
