const express = require('express');
const app = express();

app.use(require('./usuario').app);
app.use(require('./login').app);
app.use(require('./categoria').app);
app.use(require('./producto').app);


module.exports = {
    app
}