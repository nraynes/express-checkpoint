import express from 'express';
import db from './db/db.js';

const app = express();
app.use(express.json());

app.get('/movies', (req, res) => {
    if (req.query.title) {
        let input = req.query.title;
        if (input.match(/^\w{1,}$/i) === null) {
            res.statusCode = 400
            res.json('Invalid titleQuery supplied')
        }
        db.any(`SELECT * FROM movies WHERE LOWER("title") LIKE LOWER('%${input}%')`)
            .then(data => {
                if (data.length === 0) {
                    res.statusCode = 404
                    res.json('Your query string returned no results.')
                } else {
                    res.send(data)
                }
            })
            .catch((err) => {
                let status = res.statusCode
                if (status !== 400 && status !== 404) {
                    console.log('There was an error: ', `response: ${status}`, err);
                    res.json('There was an error getting the movies from the database. Please check the server.')
                }
            })
    } else {
        db.any('SELECT * FROM movies')
            .then(data => {
                res.send(data)
            })
            .catch((err) => {
                let status = res.statusCode
                console.log('There was an error: ', `response: ${status}`, err);
                res.json('There was an error getting the movies from the database. Please check the server.')
            })
    }
})

app.get('/movies/:id', (req, res) => {
    let input = req.params.id
    if (input.match(/^\d{1,}$/) === null) {
        res.statusCode = 400
        res.json('Invalid ID supplied')
    }
    db.any(`SELECT * FROM movies WHERE "id"=${input}`)
        .then(data => {
            if (data.length === 0) {
                res.statusCode = 404
                res.json('Movie ID not found')
            } else {
                res.send(data)
            }
        })
        .catch((err) => {
            let status = res.statusCode
            if (status !== 400 && status !== 404) {
                console.log('There was an error: ', `response: ${status}`, err);
                res.json('There was an error getting the movies from the database. Please check the server.')
            }
        })
})

app.get('/lastMovie', (req, res) => {
    db.any('SELECT "id" FROM movies ORDER BY "id" DESC LIMIT 1')
        .then(data => {
            res.send(data)
        })
        .catch((err) => {
            console.log("ERROR: ", err)
            res.json('ERROR')
        })
})

app.post('/movies', (req, res) => {
    let input = req.body;
    db.any(`INSERT INTO movies("title","runtime","release_year","director") VALUES('${input.title}',${input.runtime},${input.release_year},'${input.director}');`)
        .then(() => {
            db.any(`SELECT * FROM movies WHERE "title"='${input.title}'`)
                .then(data => {
                    res.send(data)
                })
                .catch((err) => {
                    console.log("ERROR: ", err)
                    res.json('ERROR')
                })
        })
        .catch((err) => {
            console.log("ERROR: ", err)
            res.json('ERROR')
        })
})

app.delete('/movies/:id', (req, res) => {
    let input = req.params.id;
    db.any(`DELETE FROM movies WHERE "id"=${input};`)
        .then(() => {
            res.json('Request deletion of movie...')
        })
        .catch((err) => {
            console.log("ERROR: ", err)
            res.json('ERROR')
        })
})

export default app;