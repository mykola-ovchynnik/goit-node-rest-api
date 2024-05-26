import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import authServices from '../services/authServices.js';
import { jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';

const { TEST_DB_HOST, TEST_PORT } = process.env;

const registrationData = {
  email: 'testuseremail@mail.com',
  password: 'testpassword',
};

describe('test authRouter /register', () => {
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

  test('Register with not default subscription', async () => {
    const data = {
      email: 'testuseremail@mail.com',
      password: 'testpassword',
      subscription: 'pro',
    };

    const expectedResponse = {
      user: {
        email: 'testuseremail@mail.com',
        subscription: 'pro',
      },
    };

    const response = await request(app).post('/api/users/register').send(data);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expectedResponse);
  });

  test('Return a 400 status code when the request body is not correct', async () => {
    const wrongData = [
      { email: 'testuseremail@mail.com' },
      { password: 'testpassword' },
      {},
      { email: '', password: '' },
      { email: 'testuseremail', password: 'testpassword' },
      { email: 'testuseremail@mail.com', password: 123456789 },
      { email: 123456789, password: 'testpassword' },
      {
        email: 'testuseremail@mail.com',
        password: 'testpassword',
        subscription: 'wrong',
      },
    ];

    for (const data of wrongData) {
      const response = await request(app)
        .post('/api/users/register')
        .send(data);

      expect(response.statusCode).toBe(400);
    }
  });

  test('Return a 409 status code when the email is already in use', async () => {
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

describe('test authRouter /login', () => {
  let server = null;
  let testStartTime = null;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(TEST_PORT);
  });

  beforeEach(async () => {
    testStartTime = new Date().toUTCString();

    await request(app).post('/api/users/register').send(registrationData);
  });

  afterEach(async () => {
    await authServices.deleteUsers({ createdAt: { $gte: testStartTime } });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test('Login with valid email and password', async () => {
    const expectedResponse = {
      token: expect.any(String),
      user: {
        email: 'testuseremail@mail.com',
        subscription: 'starter',
      },
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(registrationData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toEqual(expectedResponse);
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.user.email).toBe('string');
    expect(typeof response.body.user.subscription).toBe('string');

    const user = await authServices.findUser({ email: registrationData.email });

    expect(user.token).toBe(response.body.token);
  });

  test('Return a 400 status code when the request body is not correct', async () => {
    const wrongData = [
      {},
      { email: 'testuseremail@mail.com' },
      { password: 'testpassword' },
      { email: '', password: '' },
      { email: 'testuseremail', password: 'testpassword' },
      { email: 'testuseremail@mail.com', password: 132465789 },
      { email: 132465789, password: 'testpassword' },
      { email: true, password: 'testpassword' },
    ];

    for (const data of wrongData) {
      const response = await request(app).post('/api/users/login').send(data);

      expect(response.statusCode).toBe(400);
    }
  });

  test('Return a 401 status code when login credentials are wrong', async () => {
    const wrongData = [
      { email: 'wrongtestuseremail@mail.com', password: 'wrongtestpassword' },
      { email: 'wrongtestuseremail@mail.com', password: 'testpassword' },
      { email: 'testuseremail@mail.com', password: 'wrongtestpassword' },
    ];

    for (const data of wrongData) {
      const response = await request(app).post('/api/users/login').send(data);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Email or password is wrong' });
    }
  });

  test('Return a 500 status code when the server error occurs', async () => {
    jest.spyOn(authServices, 'findUser').mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .post('/api/users/login')
      .send(registrationData);

    expect(response.statusCode).toBe(500);
  });
});

describe('test authRouter /logout, /current, PATCH update subscription, PATCH update avatar', () => {
  let server = null;
  let testStartTime = null;
  let loginResponse = null;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(TEST_PORT);
  });

  beforeEach(async () => {
    testStartTime = new Date().toUTCString();

    await request(app).post('/api/users/register').send(registrationData);
    loginResponse = await request(app)
      .post('/api/users/login')
      .send(registrationData);
  });

  afterEach(async () => {
    await authServices.deleteUsers({ createdAt: { $gte: testStartTime } });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test('Logout with valid token', async () => {
    const token = loginResponse.body.token;

    const response = await request(app)
      .post('/api/users/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);

    const user = await authServices.findUser({ email: registrationData.email });

    expect(user.token).toBeNull();
  });

  test('Logout without authorization header returns status 401 and error message', async () => {
    const response = await request(app).post('/api/users/logout');

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: 'Not authorized' });
  });

  test('Logout with wrong token returns status 401 and error message', async () => {
    const wrongToken = ['', 'wrongtoken', 'Bearer wrongtoken'];

    for (const token of wrongToken) {
      const response = await request(app)
        .post('/api/users/logout')
        .set('Authorization', `${token}`);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Not authorized' });
    }
  });

  test('Get current user', async () => {
    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      email: 'testuseremail@mail.com',
      subscription: 'starter',
    });
  });

  test('Get current user without authorization header returns status 401 and error message', async () => {
    const response = await request(app).get('/api/users/current');

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: 'Not authorized' });
  });

  test('Update subscription successful', async () => {
    const token = loginResponse.body.token;

    const response = await request(app)
      .patch('/api/users/')
      .set('Authorization', `Bearer ${token}`)
      .send({ subscription: 'pro' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      email: 'testuseremail@mail.com',
      subscription: 'pro',
    });
  });

  test('Return a 400 status code when the request body is not correct', async () => {
    const wrongData = [
      {},
      { subscription: 'wrong' },
      { subscription: 123 },
      { subscription: true },
    ];

    for (const data of wrongData) {
      const token = loginResponse.body.token;

      const response = await request(app)
        .patch('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(response.statusCode).toBe(400);
    }
  });

  test('Update subscription without authorization header returns status 401 and error message', async () => {
    const response = await request(app)
      .patch('/api/users/')
      .send({ subscription: 'pro' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: 'Not authorized' });
  });

  test('Update avatar successful', async () => {
    const testImagePath = path.resolve('public', 'testAssets', 'testImage.jpg');

    const token = loginResponse.body.token;

    const response = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', testImagePath);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      avatarURL: expect.stringContaining('testImage.jpg'),
    });

    const destinationPath = path.resolve('public', response.body.avatarURL);
    await fs.unlink(destinationPath);
  });

  test('Update avatar without authorization header returns status 401 and error message', async () => {
    const response = await request(app).patch('/api/users/avatars');

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: 'Not authorized' });
  });

  test('Update avatar without file returns status 400 and error message', async () => {
    const token = loginResponse.body.token;

    const response = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ message: 'Avatar is required' });
  });
});
