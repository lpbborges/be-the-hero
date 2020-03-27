const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Logon', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should not be able to login with a invalid ID', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        id: '111111'
      });    
    
    expect(response.status).toBe(400);
  });

  it('should be able to login with valid ID', async () => {
    let response = await request(app)
      .post('/ongs')
      .send({
        name: "ONG - test",
        email: "contato@ongtest.com",
        whatsapp: "11123456789",
        city: "São Paulo",
        uf: "SP"
      });

    const id = response.body.id;

    response = await request(app)
      .post('/sessions')
      .send({
        id: id
      });    
    
    expect(response.body).toHaveProperty('name');
  });  
});