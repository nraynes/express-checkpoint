import request from 'supertest';
import app from './app';


describe('GET /.movies', () => {
    test('should be able to get a list of movies from the database', async () => {
        let myRequest = await request(app).get('/movies')
        JSON.stringify(myRequest)
        if (Array.isArray(myRequest.body)) {
            if (myRequest.body.length > 0) {
                for (let i=0;i<myRequest.body.length;i++) {
                    expect(myRequest.body[0].id).toBeTruthy();
                    expect(myRequest.body[0].title).toBeTruthy();
                    expect(myRequest.body[0].runtime).toBeTruthy();
                    expect(myRequest.body[0].release_year).toBeTruthy();
                    expect(myRequest.body[0].director).toBeTruthy();
                }
            } else {
                expect(false).toEqual(true);
            }
        } else {
            expect(false).toEqual(true);
        }
    })
})

describe('GET /movies/:id', () => {
    test('should be able to get a movie by a specific id number', async () => {
        let response = await request(app).get('/movies/3')
        JSON.stringify(response);
        expect(response.body[0].id).toEqual(3)
        expect(response.body[0].title).toEqual("From Paris With Love")
        expect(response.body[0].runtime).toEqual(94)
        expect(response.body[0].release_year).toEqual(2010)
        expect(response.body[0].director).toEqual("Pierre Morel")
    })
    test('should get an error saying "Movie ID not found" when given an invalid book id and status code of 404', async () => {
        let response = await request(app).get('/movies/4')
        JSON.stringify(response);
        let result = response.body
        expect(response.statusCode).toEqual(404)
        expect(result).toEqual('Movie ID not found')
    })
    test('should get an error saying "Invalid ID supplied" when given an invalid id and  a status code of 400', async () => {
        let response = await request(app).get('/movies/3ofd')
        JSON.stringify(response);
        let result = response.body
        expect(response.statusCode).toEqual(400)
        expect(result).toEqual('Invalid ID supplied')
    })
})

describe('GET /movies/?title=paris', () => {
    test('should be able to get a movie by a specific id number', async () => {
        let response = await request(app).get('/movies/?title=paris')
        JSON.stringify(response);
        expect([1, 3]).toContain(response.body[0].id)
        expect(["Midnight In Paris", "From Paris With Love"]).toContain(response.body[0].title)
        expect([96, 94]).toContain(response.body[0].runtime)
        expect([2010, 2011]).toContain(response.body[0].release_year)
        expect(["Pierre Morel", "Woody Allen"]).toContain(response.body[0].director)
        expect([1, 3]).toContain(response.body[1].id)
        expect(["Midnight In Paris", "From Paris With Love"]).toContain(response.body[1].title)
        expect([96, 94]).toContain(response.body[1].runtime)
        expect([2010, 2011]).toContain(response.body[1].release_year)
        expect(["Pierre Morel", "Woody Allen"]).toContain(response.body[1].director)
    })
    test('should get an error saying "Your query string returned no results." when given an query that has nothing returned and  a status code of 404', async () => {
        let response = await request(app).get('/movies/?title=lkjjabbeof')
        JSON.stringify(response);
        let result = response.body
        expect(response.statusCode).toEqual(404)
        expect(result).toEqual('Your query string returned no results.')
    })
    test('should get an error saying "Invalid titleQuery supplied" when given an query that has nothing returned and  a status code of 400', async () => {
        let response = await request(app).get('/movies/?title={}:D#R2')
        JSON.stringify(response);
        let result = response.body
        expect(response.statusCode).toEqual(400)
        expect(result).toEqual('Invalid titleQuery supplied')
    })
})

describe('GET /lastMovie', () => {
    test('should be able to get the last movie id that was added', async () => {
        let lastID = await request(app).get('/lastMovie')
        let lastMovie = lastID.body[0].id
        expect(lastMovie).toEqual(3);
    })
})

describe('POST /movies', () => {
    test('should be able to post a movie to the database', async () => {
        await request(app).post('/movies').send({
            title: "Star Wars IV",
            runtime: 125,
            release_year: 1977,
            director: "George Lucas"
        })
        let lastID = await request(app).get('/lastMovie')
        let lastMovie = lastID.body[0].id
        let response = await request(app).get(`/movies/${lastMovie}`)
        JSON.stringify(response);
        expect(response.body[0].id).toEqual(lastMovie)
        expect(response.body[0].title).toEqual("Star Wars IV")
        expect(response.body[0].runtime).toEqual(125)
        expect(response.body[0].release_year).toEqual(1977)
        expect(response.body[0].director).toEqual("George Lucas")
    })
})

describe('DELETE /movies/:id', () => {
    test('should be able to delete a movie based on id number', async () => {
        let lastID = await request(app).get('/lastMovie')
        let lastMovie = lastID.body[0].id
        await request(app).delete(`/movies/${lastMovie}`)
        let response = await request(app).get(`/movies/${lastMovie}`)
        JSON.stringify(response);
        let result = response.body
        expect(response.statusCode).toEqual(404)
        expect(result).toEqual('Movie ID not found')
    })
})