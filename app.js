const express = require('express');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to bd'))
  .catch((err) => console.log(err));

app.post('/signin', login);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required()
        .messages({
          'string.empty': 'Адрес не может быть пустым',
          'any.required': 'Необходимо указать адрес электронной почты',
        }),
      password: Joi.string().required()
        .messages({
          'string.empty': 'Пароль не может быть пустым',
          'any.required': 'Необходимо ввести пароль',
        }),
    }),
  }),
  createUser,
);

app.use(auth);

app.use(routes);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
