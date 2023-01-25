const router = require("express").Router();

const { tryCatchWrapper, auth, upload } = require("../../middlewares");
const { getCurrent, updateAvatar } = require("../../controllers");

router.get("/current", auth, tryCatchWrapper(getCurrent));
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  tryCatchWrapper(updateAvatar)
);

module.exports = router;
