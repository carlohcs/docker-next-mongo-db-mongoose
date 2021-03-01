const express = require('express');
const env = process.env.NODE_ENV;
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;
const bcrypt = require('bcryptjs');
const connection = require('./src/db/connection');
const { UserModel, GameModel, ImageModel, enums } = require('./src/models');
const port = 5000;

function logErrors(err, req, res, next) {
  console.error('[backend] Error: ', err.stack);
  console.log('[backend] Request: ', req);
  console.log('[backend] Response: ', res);
  next(err);
}

console.log('ENV:', env);

// Previne o erro de não conseguir ler req.body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Previne erros de acesso por outros servidores
app.use(cors());

// Previne a quebra da aplicação por algum erro na aplicação/rotas
app.use(logErrors);

/**
 * Rota principal - Boas vindas ao backend
 *
 * @return {String}
 */
app.get('/', async (req, res) => {
  res.send('Welcome to backend!');
});

// https://dev.to/mkilmer/how-create-relationships-with-mongoose-and-node-js-with-real-example-43ei
require('./src/routes')(app);

/**
 * Popula o banco de dados
 *
 * @return {JSON}
 */
app.get('/populate-schema', async (req, res) => {
  console.log('[backend] Populating database...');

  connection
    .then(async (connect) => {
      const usersData = [
        {
          name: 'John Doe',
          email: 'john.doe@provedor.com',
          password: '123456'
        },
        {
          name: 'Jailson Mendes',
          email: 'jailson.mendes@provedor.com',
          password: '123456'
        },
        {
          name: 'Hepaminondas',
          email: 'hepaminondas@provedor.com',
          password: '123456'
        }
      ];

      const gamesData = [
        {
          name: 'Tomb Raider',
          description:
            'Mussum Ipsum, cacilds vidis litro abertis. Aenean aliquam molestie leo, vitae iaculis nisl. Cevadis im ampola pa arma uma pindureta. Atirei o pau no gatis, per gatis num morreus. Copo furadis é disculpa de bebadis, arcu quam euismod magna.',
          resume: 'Mussum Ipsum, cacilds vidis litro abertis.',
          file: 'tom-raider.exe',
          status: enums.game.status.DEV_LOG,
          user: null
        },
        {
          name: 'Need for Speed Heat',
          description:
            'Need for Ipsum, cacilds vidis litro abertis. Aenean aliquam molestie leo, vitae iaculis nisl. Cevadis im ampola pa arma uma pindureta. Atirei o pau no gatis, per gatis num morreus. Copo furadis é disculpa de bebadis, arcu quam euismod magna.',
          resume: 'Need for Ipsum, cacilds vidis litro abertis.',
          file: 'need-for-speed.exe',
          status: enums.game.status.BETA_TEST,
          user: null
        },
        {
          name: 'Call of Duty',
          description:
            'Call of Duty for Ipsum, cacilds vidis litro abertis. Aenean aliquam molestie leo, vitae iaculis nisl. Cevadis im ampola pa arma uma pindureta. Atirei o pau no gatis, per gatis num morreus. Copo furadis é disculpa de bebadis, arcu quam euismod magna.',
          resume: 'Call of Duty for Ipsum, cacilds vidis litro abertis.',
          file: 'call-of-duty.exe',
          status: enums.game.status.STABLE,
          user: null
        }
      ];

      const usersImages = [
        {
          name: 'john-doe-avatar.jpg',
          type: enums.image.type.THUMBNAIL,
          user: null
        },
        {
          name: 'jailson-mendes-avatar.jpg',
          type: enums.image.type.THUMBNAIL,
          user: null
        },
        {
          name: 'hepaminondas-avatar.jpg',
          type: enums.image.type.THUMBNAIL,
          user: null
        }
      ];

      const gamesImages = [
        {
          name: 'tomb-raider-wall.jpg',
          type: enums.image.type.BANNER,
          game: null
        },
        {
          name: 'nfs-heat-wall.jpg',
          type: enums.image.type.BANNER,
          game: null
        },
        {
          name: 'cod-wall.jpg',
          type: enums.image.type.BANNER,
          game: null
        }
      ];

      let savedGames = [];

      console.log('-----------------------------------');

      console.log('[backend] Populating users schema...');

      const users = await UserModel.insertMany(usersData);

      console.log('[backend] Done!');
      console.log('-----------------------------------');

      console.log('[backend] Populating games schema...');

      const saveGames = async () => {
        for (let index = 0; index < users.length; index++) {
          const currentGame = gamesData[index];
          const currentUser = users[index];
          const userId = currentUser.id;

          currentGame.user = userId;

          let game = await GameModel.create(currentGame);

          savedGames.push(game);

          currentUser.games.push(game);

          await currentUser.save();
        }
      };

      await saveGames();

      console.log('[backend] Done!');
      console.log('-----------------------------------');

      console.log('[backend] Populating images schema...');

      const saveUsersImages = async () => {
        console.log('[backend] Populating images from users schema...');

        for (let index = 0; index < users.length; index++) {
          const currentImage = usersImages[index];
          const currentUser = users[index];
          const userId = currentUser.id;

          currentImage.user = userId;

          let image = await ImageModel.create(currentImage);

          currentUser.image = image;

          await currentUser.save();
        }
      };

      await saveUsersImages();

      console.log('[backend] Done!');
      console.log('-----------------------------------');

      const saveGameImages = async () => {
        console.log('[backend] Populating images from games schema...');

        for (let index = 0; index < gamesImages.length; index++) {
          const currentImage = gamesImages[index];
          const currentGame = savedGames[index];
          const gameId = currentGame.id;

          currentImage.game = gameId;

          let image = await ImageModel.create(currentImage);

          currentGame.images.push(image);

          await currentGame.save();
        }
      };

      await saveGameImages();

      console.log('[backend] Done!');
      console.log('-----------------------------------');

      mongoose.connection.close();

      res.json({ message: `[backend] Done. ${users}` });
    })
    .catch((error) => {
      console.log('Connection error: ', error);
    });
});

/**
 * Roda o servidor na porta definida
 *
 * @return {void}
 */
app.listen(port, () => {
  console.log('[backend] Server listening from ', port);
});
