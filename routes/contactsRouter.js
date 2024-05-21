import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import contactsControllers from '../controllers/contactsControllers.js';
import contactsSchemas from '../schemas/contactsSchemas.js';
import isBodyEmpty from '../middlewares/isBodyEmpty.js';
import isValidId from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsControllers.getAllContacts);

contactsRouter.get('/:id', isValidId, contactsControllers.getOneContact);

contactsRouter.delete('/:id', isValidId, contactsControllers.deleteContact);

contactsRouter.post(
  '/',
  isBodyEmpty,
  validateBody(contactsSchemas.createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  '/:id',
  isValidId,
  isBodyEmpty,
  validateBody(contactsSchemas.updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  '/:id/favorite',
  isValidId,
  isBodyEmpty,
  validateBody(contactsSchemas.updateStatusSchema),
  contactsControllers.updateStatus
);

export default contactsRouter;
