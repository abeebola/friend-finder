var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

app.set('port', process.env.PORT || 3000)
    .set('view engine', 'ejs')
    .set('views', 'app/views');

app.use(bodyParser.json())
    .use(cookieParser())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static('app/dist/public'))
    .use(require('./routes/index'))
    .use(require('./routes/you'))
    .use(require('./routes/db'))
    .use(require('./routes/friends'))
    .listen(3000, function () {
        console.log('Listening on port 3000...');
    });