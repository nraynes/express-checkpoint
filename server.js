import app from './app.js';

let port = 3000;

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/ ...`)
})