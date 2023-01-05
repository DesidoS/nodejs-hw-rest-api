const express = require("express");
const { addContactSchema } = require("../../schemas/contacts");

const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  res.json(await listContacts());
});

router.get("/:contactId", async (req, res, next) => {
  const contactById = await getContactById(req.params.contactId);
  if (contactById.length !== 0) {
    res.status(200).json(await contactById);
    return;
  }

  res.status(404).json({ message: "Not found" });
});

router.post("/", async (req, res, next) => {
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    return res.status(404).json(error.details[0].message);
  }

  const { name, email, phone } = req.body;

  const newContact = {
    name,
    email,
    phone,
  };

  const contacts = await addContact(newContact);
  res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const contactById = await getContactById(req.params.contactId);

  if (contactById.length !== 0) {
    await removeContact(req.params.contactId);
    res.status(200).json({ message: "contact deleted" });
    return;
  }
  res.status(404).json({ message: "Not found" });
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    return res.status(404).json(error.details[0].message);
  }

  const id = req.params.contactId;

  const contact = await updateContact(id, req.body);
  res.status(200).json(contact);
});

module.exports = router;
