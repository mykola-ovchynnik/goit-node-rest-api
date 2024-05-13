import Contact from '../models/Contact.js';

export const listContacts = (filter = {}) => Contact.find(filter);

export const getContactById = id => Contact.findById(id);

export const addContact = data => Contact.create(data);

export const updateContactById = (id, body) => Contact.findByIdAndUpdate(id, body);

export const updateStatusContact = (id, body) =>
  Contact.findByIdAndUpdate(id, { favorite: body.favorite });

export const removeContactById = id => Contact.findByIdAndDelete(id);
