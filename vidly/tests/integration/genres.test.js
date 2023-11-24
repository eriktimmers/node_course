const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require("mongoose");

let server;

describe('api/genres', () => {
    beforeEach(async () => {
        server = require('../../index');
    });

    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();

        });
    });

    describe('GET /:id', () => {
        it('should return the specified genre if valid id is passed', async () => {
            // const records = await Genre.collection.insertMany([
            //     { name: 'genre1' },
            // ]);
            // const first = records.insertedIds[0];
            // const res = await request(server).get(`/api/genres/${first}`);

            const genre = new Genre({ name: 'genre1' });
            await genre.save();

            const res = await request(server).get(`/api/genres/` + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const randomId = new mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${randomId}`);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();
            const genre = Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id' );
            expect(res.body).toHaveProperty('name', 'genre1' );
        });
    });

    describe('PUT /:id', () => {

        let token;
        let name;
        let genre;
        let genreId;

        beforeEach(async() => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            genreId = genre._id;
            token = new User().generateAuthToken();
            name = 'genre2';
        })

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + genreId)
                .set('x-auth-token', token)
                .send({ name });
        }

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 404 if invalid id is passed', async () => {
            genreId = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should change the genre if it is valid', async () => {
            const res = await exec();

            const genre = Genre.find({ name: 'genre2' });

            expect(genre).not.toBeNull();
        });
    });

    describe('DELETE /:id', () => {
        beforeEach(async() => {
            genre = new Genre({ name: 'genre1' });
            await genre.save();

            genreId = genre._id;
            token = new User({ isAdmin: true }).generateAuthToken();
            name = 'genre2';
        })

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + genreId)
                .set('x-auth-token', token);
        }

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if invalid id is passed', async () => {
            genreId = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should remover the genre if it is valid', async () => {
            const res = await exec();

            const genre = await Genre.findById(genreId);

            expect(genre).toBeNull();
        });
    });
});