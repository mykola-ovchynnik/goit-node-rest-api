import Contact from '../models/Contact.js';

export const listContacts = ({ filter = {}, fields = '', settings = {} }) => {
  return Contact.find(filter, fields, settings).populate('owner', 'email subscription');
};

export const getContact = filter => Contact.findOne(filter);

export const addContact = data => Contact.create(data);

export const updateOneContact = (filter, body) => Contact.findOneAndUpdate(filter, body);

export const updateStatusContact = (filter, body) =>
  Contact.findOneAndUpdate(filter, { favorite: body.favorite });

export const removeContact = filter => Contact.findOneAndDelete(filter);
