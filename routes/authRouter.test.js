import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import authServices from '../services/authServices.js';
import { jest } from '@jest/globals';

const { TEST_DB_HOST, TEST_PORT } = process.env;

describe('test authRouter registration', () => {
  let server = null;
  let testStartTime = null;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(TEST_PORT);
  });

  beforeEach(() => {
    testStartTime = new Date().toUTCString();
  });

  afterEach(async () => {
    await authServices.deleteUsers({ createdAt: { $gte: testStartTime } });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test('Register a new user with valid email and password', async () => {
    const registrationData = {
      email: 'testuseremail@mail.com',
      password: 'testpassword',
    };

    const expectedResponse = {
      user: {
        email: 'testuseremail@mail.com',
        subscription: 'starter',
      },
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(registrationData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual(expectedResponse);
  });

  test('Return a 400 status code when the request body is not correct', async () => {
    const wrongData = [
      { email: 'testuseremail@mail.com' },
      { password: 'testpassword' },
      {},
    ];

    for (const data of wrongData) {
      const response = await request(app)
        .post('/api/users/register')
        .send(data);

      expect(response.statusCode).toBe(400);
    }
  });

  test('Return a 409 status code when the email is already in use', async () => {
    const registrationData = {
      email: 'testuseremail@mail.com',
      password: 'testpassword',
    };

    await request(app).post('/api/users/register').send(registrationData);

    const response = await request(app)
      .post('/api/users/register')
      .send(registrationData);

    expect(response.statusCode).toBe(409);
  });

  test('Return a 500 status code when the server error occurs', async () => {
    const registrationData = {
      email: 'testuseremail@mail.com',
      password: 'testpassword',
    };

    jest.spyOn(authServices, 'saveUser').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .post('/api/users/register')
      .send(registrationData);

    expect(response.statusCode).toBe(500);
  });
});
