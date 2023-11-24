const request = require('supertest');
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe('Auth Middleware', () => {
    beforeEach(() => {
        server = require('../../index');
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });

    let token;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if an invalid token is provided', async () => {
        token = 'invalid';

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if a valid token is provided', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});