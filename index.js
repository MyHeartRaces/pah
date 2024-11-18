const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const historyRouter = require('./routes/history');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/actions', historyRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Product Action History Service running on port ${PORT}`);
});
