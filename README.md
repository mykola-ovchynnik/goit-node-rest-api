# Contacts API

This project provides a simple API for managing contacts. It includes operations for creating,
reading, updating, and deleting contacts.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mykola-ovchynnik/goit-node-rest-api.git
cd goit-node-rest-api
npm install
```

## Usage

The API provides the following endpoints:

- `GET /contacts`: Get all contacts.
- `GET /contacts/:id`: Get a single contact by ID.
- `POST /contacts`: Create a new contact.
- `PUT /contacts/:id`: Update a contact by ID.
- `DELETE /contacts/:id`: Delete a contact by ID.

## Controllers

The controllers for these endpoints are defined in `contactsControllers.js`. Each controller is
wrapped with a decorator that handles error propagation.

## Services

The actual operations on the contacts are performed by the services defined in
`contactsServices.js`. These services interact with the data source to fetch, create, update, and
delete contacts.

## Error Handling

Errors are handled using the `HttpError` helper. This helper throws an HTTP error with a specific
status code and message.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would
like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
