var express = require('express')
, app = express.createServer();

// config
app.configure(function(){
    console.log(__dirname);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'mustache');
    app.register(".mustache", require('stache'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));
    app.use(require('browserify')({
        require : __dirname + '/../shared/main'
    }));
});

// routes
app.get('/', function (req, res) {
    res.render('index', {
        locals: {
            title: 'Welcome',
            page:{
                main: true
            }
        }
    });
});

exports.app = app;
