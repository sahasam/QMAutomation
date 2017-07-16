
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load customers route
var inventory = require('./routes/inventory');
var app = express();

var connection  = require('express-myconnection');
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request
-------------------------------------------*/

app.use(

    connection(mysql,{

        host: 'qmshack.cuzcjr7fyf0r.us-east-1.rds.amazonaws.com',
        user: 't476',
        password : 'troop476',
        port : 3306, //port mysql
        database:'t476'

    },'pool') //or single

);



app.get('/', routes.index);
app.get('/inventory', inventory.list);
app.get('/inventory/add', inventory.add);
app.post('/inventory/add', inventory.save);
app.get('/inventory/delete/:id', inventory.delete_gear);
app.get('/inventory/edit/:id', inventory.edit);
app.post('/inventory/edit/:id',inventory.save_edit);


app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
