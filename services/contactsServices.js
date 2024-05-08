import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('db', 'contacts.json');

const updateContactsList = async contacts => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

export const listContacts = async () => {
  const fileContent = await fs.readFile(contactsPath);
  const contacts = JSON.parse(fileContent);
  return contacts;
};

export const getContactById = async contactId => {
  const contacts = await listContacts();

  const contact = contacts.find(({ id }) => id === contactId);

  if (!contact) {
    return null;
  }

  return contact;
};

export const addContact = async data => {
  const contacts = await listContacts();

  const newContact = { id: nanoid(), ...data };
  contacts.push(newContact);

  await updateContactsList(contacts);

  return newContact;
};

export const removeContact = async contactId => {
  const contacts = await listContacts();

  const index = contacts.findIndex(item => item.id === contactId);

  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);
  await updateContactsList(contacts);

  return result;
};

export const updateContactById = async (id, data) => {
  const contacts = await listContacts();

  const index = contacts.findIndex(item => item.id === id);

  if (index === -1) {
    return null;
  }

  contacts[index] = { ...contacts[index], ...data };
  await updateContactsList(contacts);

  return contacts[index];
};
