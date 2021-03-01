const { UserModel, GameModel, ImageModel, enums } = require('../models');

module.exports = function (app) {
  /**
   * Lista todos os usuários
   *
   * @return {JSON}
   */
  app.get('/users', async (req, res) => {
    const users = await UserModel.find().populate('games').populate('image');

    res.json(users);
  });

  /**
   * Lista usuário pelo ID
   *
   * @return {JSON}
   */
  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.find({ _id: id }).populate('games').populate('image');

    res.json(user);
  });

  /**
   * Salva um novo usuário mediante validação
   *
   * @return {JSON}
   */
  app.post('/users', async (req, res) => {
    const validate = await UserModel.find({
      email: req.body.email
    });

    if (validate) {
      return res.json({
        message: 'Already have one user with this e-mail.'
      });
    } else {
      console.log('[backend] Saving a new user...');

      const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      await user.save();

      res.json(user);

      /*
      bcrypt.genSalt(10, (erro, salt) => {
        bcrypt.hash(novoUser.senha, salt, (erro, hash) => {
          if (erro) {
            res.json({
              message: 'Erro ao cadastrar o Usuario'
            });
          } else {
            novoUser.senha = hash;
            novoUser.save();
            res.json({
              message: 'Usuario Cadastrado com sucesso!',
              usuario: novoUsuario
            });
          }
        });
      });
      */
    }
  });

  /**
   * Altera um usuário
   *
   * @return {JSON}
   */
  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findOne({
      _id: id
    });

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save();

    res.json({
      message: 'User was edited.'
    });
  });

  /**
   * Deleta um usuário
   *
   * @return {String}
   */
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    await UserModel.findOneAndDelete({
      _id: id
    });

    res.json({ message: 'User deleted.' });
  });
};
