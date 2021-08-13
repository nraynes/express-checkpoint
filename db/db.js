import pgPromise from 'pg-promise';
const pgp = pgPromise({});
const dbParams = {
    platform: "postgresql",
    host: "localhost",
    port: "52193",
    username: "postgres",
    password: "myPass",
    database: "gmdb"
};

let colon = '';
if (dbParams.password) {
    colon = ':'
};
const dbConnect = `${dbParams.platform}://${dbParams.username}${colon}${dbParams.password}@${dbParams.host}:${dbParams.port}/${dbParams.database}`;
console.log(dbConnect)
var db = pgp(dbConnect)
db.connect()
    .then(obj => {
        const serverVersion = obj.client.serverVersion;
        console.log(`Connected to database, version `, serverVersion)
        obj.done();
    })
    .catch(error => {
        console.log('Database connection error...')
        console.log('ERROR:', error.message);
    });

export default db;