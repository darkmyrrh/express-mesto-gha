const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users')
const {
  NOT_FOUND,
} = require('./utils/responceCodes');
const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to bd'))
  .catch((err) => console.log(err));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(routes);


app.use('/', (req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
