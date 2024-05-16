import controllerWrapper from '../decorators/controllerWrapper.js';
import HttpError from '../helpers/HttpError.js';
import { getQueryFilter, getQuerySettings } from '../helpers/getQuery.js';
import {
  getContact,
  listContacts,
  removeContact,
  addContact,
  updateOneContact,
  updateStatusContact,
} from '../services/contactsServices.js';

export const getAllContacts = controllerWrapper(async (req, res) => {
  const filter = getQueryFilter(req);

  const fields = '-createdAt -updatedAt';

  const settings = getQuerySettings(req.query);

  const result = await listContacts({ filter, fields, settings });

  res.json(result);
});

export const getOneContact = controllerWrapper(async (req, res) => {
  const result = await getContact({ _id: req.params.id, owner: req.user });

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
});

export const createContact = controllerWrapper(async (req, res) => {
  const owner = req.user._id;
  const result = await addContact({ ...req.body, owner });

  res.status(201).json(result);
});

export const updateContact = controllerWrapper(async (req, res) => {
  const owner = req.user._id;
  const result = await updateOneContact({ _id: req.params.id, owner }, req.body);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
});

export const updateStatus = controllerWrapper(async (req, res) => {
  const owner = req.user._id;
  const result = await updateStatusContact({ _id: req.params.id, owner }, req.body);

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
});

export const deleteContact = controllerWrapper(async (req, res) => {
  const owner = req.user._id;
  const result = await removeContact({ _id: req.params.id, owner });

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
});
