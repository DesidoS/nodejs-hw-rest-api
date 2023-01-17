const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
  changeFavoriteContact,
} = require("../../controllers/contacts.controller");
const { favoriteSchema, addContactSchema } = require("../../schemas/contacts");
const {
  validationFavorite,
  tryCatchWrapper,
  validationContact,
} = require("../../middlewares/");

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContact));

router.post("/", tryCatchWrapper(createContact));

router.delete("/:contactId", tryCatchWrapper(deleteContact));

router.put(
  "/:contactId",
  validationContact(addContactSchema),
  tryCatchWrapper(changeContact)
);

router.patch(
  "/:contactId/favorite",
  validationFavorite(favoriteSchema),
  tryCatchWrapper(changeFavoriteContact)
);

module.exports = router;
