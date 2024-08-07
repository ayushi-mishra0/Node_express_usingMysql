const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const swig = require('swig');
const userRoutes = require('./routes/userRoutes');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
