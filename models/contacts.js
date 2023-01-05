const fs = require("fs/promises");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

const contactsPath = path.resolve(__dirname, "contacts.json");

async function readDb() {
  const dbRaw = await fs.readFile(contactsPath);
  const db = JSON.parse(dbRaw);
  return db;
}
async function writeDb(db) {
  await fs.writeFile(contactsPath, JSON.stringify(db, null, 2));
}

async function listContacts() {
  const list = await fs.readFile(contactsPath, { encoding: "utf8" });
  const contactList = JSON.parse(list);
  return contactList;
}

async function getContactById(contactId) {
  const db = await readDb();
  const contactById = db.filter((contact) => contact.id === contactId);

  return contactById;
}

async function removeContact(contactId) {
  const db = await readDb();
  const newDb = db.filter((contact) => contact.id !== contactId);
  await writeDb(newDb);
}

async function addContact({ name, email, phone }) {
  const id = uuidv4();
  const contact = { id, name, email, phone };
  const db = await readDb();
  db.push(contact);
  await writeDb(db);
}

async function updateContact(contactId, body) {
  const db = await readDb();

  const contactIndex = db.findIndex((item) => item.id === contactId);
  if (contactIndex === -1) return;

  db[contactIndex] = { id: contactId, ...body };
  await writeDb(db);

  return db[contactIndex];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
