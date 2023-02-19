const router = require("express").Router();

const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
  changeFavoriteContact,
} = require("../../controllers");
const { favoriteSchema, addContactSchema } = require("../../schemas/contacts");
const {
  validationFavorite,
  tryCatchWrapper,
  validation,
  auth,
} = require("../../middlewares/");

router.get("/", auth, tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContact));

router.post("/", auth, tryCatchWrapper(createContact));

router.delete("/:contactId", tryCatchWrapper(deleteContact));

router.put(
  "/:contactId",
  validation(addContactSchema),
  tryCatchWrapper(changeContact)
);

router.patch(
  "/:contactId/favorite",
  validationFavorite(favoriteSchema),
  tryCatchWrapper(changeFavoriteContact)
);

module.exports = router;
