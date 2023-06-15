const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected to bd'))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  req.user = {
    _id: '648368130423e1f167b9f218',
  };

  next();
});
app.use(routes);

app.use('/', (req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
