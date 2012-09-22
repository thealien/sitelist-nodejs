var express = require('express'), 
    routes = require('./routes'),
    models = require('./models'),
    http = require('http');
	
var app = express();

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------
app.configure(function(){
	app.engine('html', require('jade').renderFile);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

//
//
//
function getLastLinks(req, res, next){
    models.Link.getLastLinks(function(error, lastLinks){
        if(!error)
            res.locals.lastLinks = lastLinks;
        next();
    });
}

//
//
//
app.locals(require('./views/helpers.js'));
app.locals({
    lastLinks: false,
    defaultTitle: 'Каталог сайтов SiteList',
    title: false
});
//
//Params
//


// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
app.all('*', getLastLinks);
app.get('/', routes.index);

app.get('/about', routes.about);

app.get('/feedback', routes.feedback);

app.get('/category/:id/:slug/:page', routes.category);
app.get('/category/:id*', routes.category);

app.get('/top', routes.top);
app.get('/top/:page', routes.top);

app.get('/new', routes.new);
app.get('/new/:page', routes.new);

app.get('/users', routes.users);
app.get('/users/:page', routes.users);

app.get('/user/:username', routes.user);

app.get('/link/:id*', routes.link);

app.get('/collection/:id', routes.collection);
app.get('/collection/rss/:id', routes.collection_rss);


app.get('/rss/:category', routes.category_rss); //TODO
app.get('/rss', routes.rss); //TODO







// -----------------------------------------------------------------------------
// Start server 
// -----------------------------------------------------------------------------
http.createServer(app).listen(6789, '127.0.0.1', function(){
  console.log("Express server listening on port 6789");
});