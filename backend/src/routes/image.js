const { UserModel, GameModel, ImageModel, enums } = require('../models');

module.exports = function (app) {
  /**
   * Lista todas as imagens
   *
   * @return {JSON}
   */
  app.get('/images', async (req, res) => {
    const images = await ImageModel.find();

    res.json(images);
  });

  /**
   * Lista imagem pelo id
   *
   * @return {JSON}
   */
  app.get('/images/:id', async (req, res) => {
    const { id } = req.params;
    const image = await ImageModel.findOne({ _id: id });

    res.json(image);
  });

  /**
   * Salva uma nova imagem mediante validação
   *
   * @return {JSON}
   */
  app.post('/images', async (req, res) => {
    const validate = await ImageModel.findOne({
      name: req.body.name,
      type: req.body.type
    });

    if (validate) {
      return res.json({
        message: 'Already have one image with this name.'
      });
    } else {
      console.log('[backend] Saving a new image...');

      const userId = req.body.userId ? req.body.userId : null;
      const gameId = req.body.gameId ? req.body.gameId : null;

      const image = await ImageModel.create({
        name: req.body.name,
        type: req.body.type,
        user: userId,
        game: gameId
      });

      const imageId = image._id;

      if (userId) {
        // https://kb.objectrocket.com/mongo-db/how-to-do-a-one-to-many-join-using-mongoose-229
        await UserModel.findOneAndUpdate(
          {
            _id: userId
          },
          {
            $set: {
              image: imageId
            }
          },
          { new: true }
        );

        console.log('[backend] User image saved!');
      
      } else if (gameId) {
        await GameModel.findOneAndUpdate(
          {
            _id: gameId
          },
          {
            $push: {
              images: imageId
            }
          },
          { new: true }
        );
      }

      console.log('[backend] Game image saved!');
      
      res.json(image);
    }
  });

  /**
   * Altera uma imagem
   *
   * @return {JSON}
   */
  app.put('/images/:id', async (req, res) => {
    const { id } = req.params;
    const image = await ImageModel.findOne({
      _id: id
    });

    image.name = req.body.name;

    image.save();

    res.json({
      message: 'Game was edited.'
    });
  });

  /**
   * Deleta uma imagem
   *
   * @return {String}
   */
  app.delete('/images/:id', async (req, res) => {
    const { id } = req.params;

    await ImageModel.findOneAndDelete({
      _id: id
    });

    res.json({
      message: 'Game deleted.'
    });
  });
};
