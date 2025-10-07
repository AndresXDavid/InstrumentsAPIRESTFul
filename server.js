require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI)
     .then(() => {
          console.log('Conectado a MongoDB');
     })
     .catch((error) => {
          console.error('Error al conectar a MongoDB:', error);
     });

app.get('/', (req,res) => res.send('Servidor funcionando.'));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/types', require('./src/routes/types'));
app.use('/api/instruments', require('./src/routes/instruments'));

const setupSwagger = require('./swagger');
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
     console.log(`Server Ready at Port ${PORT}`);
});