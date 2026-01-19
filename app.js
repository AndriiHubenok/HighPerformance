const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const salesmanRouter = require('./routes/salesmanRouter');
const socialPerformanceRouter = require('./routes/socialPerformanceRouter');
const bonusRouter = require('./routes/bonusRouter');

const app = express();
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/salesmen', salesmanRouter)
app.use('/api/social-performance', socialPerformanceRouter)
app.use('/api/bonus', bonusRouter)

mongoose.connect('mongodb://localhost:27017/smarthoover_db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
