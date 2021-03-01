const { UserModel, GameModel, ImageModel, enums } = require('../models')

module.exports = function (app) {
  /**
   * Lista todos os jogos
   *
   * @return {JSON}
   */
  app.get('/games', async (req, res) => {
    const games = await GameModel.find({}).populate('images').populate('user');

    res.json(games);
  });

  /**
   * Lista jogo pelo ID
   *
   * @return {JSON}
   */
  app.get('/games/:id', async (req, res) => {
    const { id } = req.params;
    const game = await GameModel.findOne({ _id: id }).populate('images').populate('user');

    res.json(game);
  });

  /**
   * Salva um novo jogo mediante validação
   *
   * @return {JSON}
   */
  app.post('/games', async (req, res) => {
    const validate = await GameModel.findOne({
      name: req.body.name
    });

    if (validate) {
      return res.json({
        message: 'Already have one game with this title.'
      });
    } else {
      console.log('[backend] Saving a new game...');

      const userId = req.body.userId;

      const game = await GameModel.create({
        name: req.body.name,
        description: req.body.description,
        resume: req.body.resume,
        file: req.body.file,
        status: req.body.status,
        user: userId
      });

      // https://kb.objectrocket.com/mongo-db/how-to-do-a-one-to-many-join-using-mongoose-229
      await UserModel.findOneAndUpdate(
        {
          _id: userId
        },
        {
          $push: {
            games: game._id
          }
        },
        { new: true }
      );

      res.json(game);
    }
  });

  /**
   * Altera um jogo
   *
   * @return {JSON}
   */
  app.put('/games/:id', async (req, res) => {
    const { id } = req.params;
    const game = await GameModel.findOne({
      _id: id
    });

    game.name = req.body.name;
    game.description = req.body.description;
    game.resume = req.body.resume;
    game.file = req.body.file;
    game.status = req.body.status;

    game.save();

    res.json({
      message: 'Game was edited.'
    });
  });

  /**
   * Deleta um jogo
   *
   * @return {String}
   */
  app.delete('/games/:id', async (req, res) => {
    const { id } = req.params;

    await GameModel.findOneAndDelete({
      _id: id
    });

    res.json({ message: 'Game deleted.' });
  });
};
