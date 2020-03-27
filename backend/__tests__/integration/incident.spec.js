const request = require('supertest');

const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('Incident', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to list all incidents', async () => {
    const response = await request(app).get('/incidents');

    expect(response.status).toBe(200);
  });

  it('should be able to create a new incident', async () => {
    let response = await request(app).post('/ongs').send({
      name: 'ONG - test',
      email: 'contact@ongtest.com',
      whatsapp: '11123456789',
      city: 'São Paulo',
      uf: 'SP',
    });

    const { id } = response.body;

    response = await request(app)
      .post('/incidents')
      .set('Authorization', id)
      .send({
        title: 'Example incident',
        description: 'Just a test',
        value: 99.99,
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should be able to delete a incident', async () => {
    let response = await request(app).post('/ongs').send({
      name: 'ONG - test',
      email: 'contact@ongtest.com',
      whatsapp: '11123456789',
      city: 'São Paulo',
      uf: 'SP',
    });

    const ong_id = response.body.id;

    response = await request(app)
      .post('/incidents')
      .set('Authorization', ong_id)
      .send({
        title: 'Example incident',
        description: 'Just a test',
        value: 99.99,
      });

    const incident_id = response.body.id;

    response = await request(app)
      .delete(`/incidents/${incident_id}`)
      .set('Authorization', ong_id);

    expect(response.status).toBe(204);
  });
});
