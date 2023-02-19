const { addContactSchema } = require("../schemas/contacts");

const Contact = require("../models/contact");

async function getContacts(req, res) {
  const { _id } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ owner: _id }, "", {
    skip,
    limit: Number(limit),
  }).populate("owner", "_id name email");

  res.json(contacts);
}

async function getContact(req, res, next) {
  const contactById = await Contact.findById(req.params.contactId);

  if (!contactById) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  res.status(200).json(await contactById);
}

async function createContact(req, res, next) {
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    return res.status(404).json(error.details[0].message);
  }
  const { _id } = req.user;
  const result = await Contact.create({ ...req.body, owner: _id });
  res.status(201).json(result);
}

async function deleteContact(req, res, next) {
  const result = await Contact.findByIdAndRemove(req.params.contactId);
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
}

async function changeContact(req, res, next) {
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    return res.status(404).json(error.details[0].message);
  }
  const id = req.params.contactId;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
}
async function changeFavoriteContact(req, res, next) {
  const id = req.params.contactId;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  changeContact,
  changeFavoriteContact,
};
