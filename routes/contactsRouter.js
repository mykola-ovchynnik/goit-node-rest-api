import express from 'express';
import validateBody from '../helpers/validateBody.js';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from '../controllers/contactsControllers.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';
import isBodyEmpty from '../helpers/isBodyEmpty.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', isBodyEmpty, validateBody(createContactSchema), createContact);

contactsRouter.put('/:id', isBodyEmpty, validateBody(updateContactSchema), updateContact);

export default contactsRouter;
