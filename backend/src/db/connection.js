const mongoose = require('mongoose');
const env = process.env.NODE_ENV;
const host = env === 'dev' ? 'localhost' : 'next-mongo';

// https://stackoverflow.com/questions/49095032/cant-connect-to-mongo-docker-image-with-mongoose?answertab=votes#tab-top
function connect() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(`mongodb://${host}:27017/nextmongo`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: 'nextmongolocal',
        pass: 'nextmongo2021'
      })
      .then(() => {
        const connection = mongoose.connection;

        console.log('[backend][mongoose] Connected.');

        resolve(connection);
      })
      .catch((error) => {
        reject(`[mongoose] Connection error: ${error}`);
      });
  });
}

module.exports = connect();
