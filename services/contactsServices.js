import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateFileContent = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

export const getAllContacts = async () => {
  const fileContent = await fs.readFile(contactsPath);
  const contacts = JSON.parse(fileContent);
  return contacts;
};

export const getContactById = async (contactId) => {
  const contacts = await getAllContacts();

  const contact = contacts.find(({ id }) => id === contactId);

  if (!contact) {
    return null;
  }

  return contact;
};

export const addContact = async (data) => {
  const contacts = await getAllContacts();

  const newContact = { id: nanoid(), ...data };
  contacts.push(newContact);

  await updateFileContent(contacts);

  return newContact;
};

export const removeContact = async (contactId) => {
  const contacts = await getAllContacts();

  const index = contacts.findIndex((item) => item.id === contactId);

  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);
  await updateFileContent(contacts);

  return result;
};
