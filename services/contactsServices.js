import Contact from '../models/Contact.js';

const listContacts = ({ filter = {}, fields = '', settings = {} }) => {
  return Contact.find(filter, fields, settings).populate('owner', 'email subscription');
};

const getContact = filter => Contact.findOne(filter);

const addContact = data => Contact.create(data);

const updateOneContact = (filter, body) => Contact.findOneAndUpdate(filter, body);

const updateStatusContact = (filter, body) =>
  Contact.findOneAndUpdate(filter, { favorite: body.favorite });

const removeContact = filter => Contact.findOneAndDelete(filter);

export default {
  listContacts,
  getContact,
  addContact,
  updateOneContact,
  updateStatusContact,
  removeContact,
};
