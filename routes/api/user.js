const router = require("express").Router();

const { joiVerify } = require("../../models/user");

const {
  tryCatchWrapper,
  auth,
  upload,
  validation,
} = require("../../middlewares");
const {
  getCurrent,
  updateAvatar,
  verifyEmail,
  verifyEmailResending,
} = require("../../controllers");

router.get("/current", auth, tryCatchWrapper(getCurrent));
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  tryCatchWrapper(updateAvatar)
);
router.get("/verify/:verificationToken", tryCatchWrapper(verifyEmail));

router.post(
  "/verify",
  validation(joiVerify),
  tryCatchWrapper(verifyEmailResending)
);

module.exports = router;
