# Contacts API

This project is a RESTful API built with Node.js, Express, and MongoDB. It
provides a simple API for managing contacts. It includes operations for
creating, reading, updating, and deleting contacts.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mykola-ovchynnik/goit-node-rest-api.git
cd goit-node-rest-api
npm install
```

Before starting the server, make sure to create a .env file with same variable
as in .env.example for DB conection.

To build a Docker image for this application, run the following command in the
project directory:

```bash
docker build -t goit-node-rest-api .
```

This will create a Docker image named goit-node-rest-api.

## Usage

If you're running the application locally, you can start the server with npm
start.

If you're running the application in a Docker container, you can start the
server with the following command:

```bash
docker run --env-file .env -p 3000:3000 goit-node-rest-api
```

This command starts a Docker container from the goit-node-rest-api image, uses
the .env file for environment variables, and maps port 3000 in the container to
port 3000 on the host machine.

The API provides the following endpoints:

Contacts:

- `GET /contacts`: Get all contacts.
- `GET /contacts/:id`: Get a single contact by ID.
- `POST /contacts`: Create a new contact.
- `PUT /contacts/:id`: Update a contact by ID.
- `DELETE /contacts/:id`: Delete a contact by ID.
- `PATCH /contacts/:id/favorite`: Mark a contact as a favorite.

Authentication:

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login a user.
- `GET /auth/verify/`:verificationToken: Verify a user's email.
- `POST /auth/verify`: Resend verification email.
- `POST /auth/logout`: Logout a user.
- `GET /auth/current`: Get current user.
- `PATCH /auth`: Update user subscription.
- `PATCH /auth/avatars`: Update user avatar.

## Controllers

The controllers for these endpoints are defined in `contactsControllers.js`.
Each controller is wrapped with a decorator that handles error propagation.

## Services

The actual operations on the contacts are performed by the services defined in
contactsServices.js. These services interact with the data source to fetch,
create, update, and delete contacts, and update the favorite status of a
contact.

## Error Handling

Errors are handled using the `HttpError` helper. This helper throws an HTTP
error with a specific status code and message.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
