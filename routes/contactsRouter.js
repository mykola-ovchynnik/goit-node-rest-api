import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatus,
} from '../controllers/contactsControllers.js';
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from '../schemas/contactsSchemas.js';
import isBodyEmpty from '../middlewares/isBodyEmpty.js';
import isValidId from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', isValidId, getOneContact);

contactsRouter.delete('/:id', isValidId, deleteContact);

contactsRouter.post('/', isBodyEmpty, validateBody(createContactSchema), createContact);

contactsRouter.put(
  '/:id',
  isValidId,
  isBodyEmpty,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  isValidId,
  isBodyEmpty,
  validateBody(updateStatusSchema),
  updateStatus
);

export default contactsRouter;
