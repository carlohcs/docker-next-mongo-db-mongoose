module.exports = (app) => ({
  user: require('./user')(app),
  game: require('./game')(app),
  image: require('./image')(app)
});
