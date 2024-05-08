import controllerWrapper from '../decorators/controllerWrapper.js';
import HttpError from '../helpers/HttpError.js';
import {
  getContactById,
  listContacts,
  removeContact,
  addContact,
  updateContactById,
} from '../services/contactsServices.js';

export const getAllContacts = controllerWrapper(async (req, res) => {
  const result = await listContacts();

  res.json(result);
});

export const getOneContact = controllerWrapper(async (req, res) => {
  const result = await getContactById(req.params.id);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
});

export const createContact = controllerWrapper(async (req, res) => {
  const result = await addContact(req.body);

  res.status(201).json(result);
});

export const updateContact = controllerWrapper(async (req, res) => {
  const result = await updateContactById(req.params.id, req.body);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
});

export const deleteContact = controllerWrapper(async (req, res) => {
  const result = await removeContact(req.params.id);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
});
