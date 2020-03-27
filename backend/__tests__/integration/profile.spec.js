const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Profile', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to list all incidents of an specific ONG', async () => {
    let response = await request(app).post('/ongs').send({
      name: 'ONG - test',
      email: 'contact@ongtest.com',
      whatsapp: '11123456789',
      city: 'São Paulo',
      uf: 'SP',
    });

    const { id } = response.body;

    response = await request(app).get('/profile').set('Authorization', id);

    expect(response.status).toBe(200);
  });
});
