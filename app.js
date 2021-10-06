const express = require('express')
const app = express()
var mysql = require('mysql')
var bodyParser = require('body-parser')
var axios = require('axios')
var pach = require('path')
var to = require('./token')
var functions = require('./functions')
app.set("view engine", "ejs")
var cookieParser = require('cookie-parser')
const port = 3000
app.use(cookieParser())

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Barfas"
})

var urlencodedParser = bodyParser.urlencoded({ extended: false })


/**
 * urlencodedParser <- with this we can find req parameter from clint
 * f1 an 3 as string
 */

app.post('/ReadProfile', urlencodedParser, function (req, res) {
  var F1 = req.body.name
  function ReadProfile(F1) {
    con.connect(function(err) {
      if (err) throw err;
      //Select all customers and return the result object:
      con.query("SELECT * FROM `"+F1+"` ", function (err, result, fields) {
        if (err) throw err;
        var an =  JSON.stringify(result);
        res.set('content-type', 'application/json');
        res.send(an);
      });
    });
  }
  ReadProfile(F1);
})
///// divose list get for web

app.get('/Dlist', function (req, res) {
  function Dlist() {
    con.connect(function(err) {
      if (err) throw err;
      //Select all customers and return the result object:
      con.query("SELECT * FROM devicelist ", function (err, result, fields) {
        if (err) throw err;
        var an =  JSON.stringify(result);
        var as = JSON.parse(an);
        res.render('ds',{val : as})
      });
    });
    
  }
  Dlist();
})

app.get('/Dlists', function (req, res) {
  function Dlists() {
    con.connect(function(err) {
      if (err) throw err;
      //Select all customers and return the result object:
      con.query("SELECT * FROM devicelist ", function (err, result, fields) {
        if (err) throw err;
        res.send(result)  

      });
    });
    
  }
  Dlists();
})
///// divose list get for web
app.get('/Dlistshow', function (req, res) {

  async function get() {
    let url = '/Dlists'
    let obj = await (await fetch(url)).json();
    return obj
  }
  var tags = get();

res.end(tags[0].active)
})

///// divose list get for web
app.get('/tt', function (req, res) {





})

app.get('/rep', function (req, res) {
var aa = req.cookies.login
  if (aa != null){
    res.redirect('/Dlists')
  }

///res.send(req.cookies.login)
 ///res.redirect('/Dlists')
})

app.get('/test', function (req, res) {

var aa = functions.test()

  res.end(aa)

  
  ///res.send(req.cookies.login)
   ///res.redirect('/Dlists')
  })


/// token
///// divose list get for web
app.post('/login',urlencodedParser, function (req, res) {
 var mail = req.body.name
 function checkuser(mail) {
  con.connect(function(err) {
    if (err) throw err;
    //Select all customers and return the result object:
    con.query("SELECT * FROM `Customers` WHERE Email = '"+mail+"' ", function (err, result, fields) {
      if (err) throw err;
      var user =  result[0].Email
      var token = to.token()
      if (user === mail){
        res.cookie('login',token)
        res.send(token);

        
      }else{
        false
      }
    })
  });
}
 checkuser(mail)
 
 


})
app.post('/AddUser', urlencodedParser,function (req, res) {
  var Name = req.body.Name
  var FullName = req.body.FullName
  var Email = req.body.Email
  var PhoneNumber = req.body.PhoneNumber
  var Adress = req.body.Adress
  function AddUser() {
    con.connect(function(err) {
      if (err) throw err;
      //Select all customers and return the result object:
      var sql = "INSERT INTO `Users` (Name,FullName,Email,PhoneNumber,Adress) VALUES ('"+Name+"', '"+FullName+"', '"+Email+"', '"+PhoneNumber+"','"+Adress+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send("New User Added !");
      });
    });
  }
  AddUser();
})
 //// crate devois  culome
app.post('/Adddevicecolumn', urlencodedParser,function (req, res) {
  var Name = req.body.column
  var device = req.body.Tname

  function Adddevicecolumn(a1,a2) {
    con.connect(function(err) {
      if (err) throw err;
      //Select all customers and return the result object:
      var sql = "ALTER table "+a2+" add column ("+a1+" varchar(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send("New column Added !");
      });
    });
  }
  Adddevicecolumn(Name,device);
})
 //// crate devois  table
 app.post('/Adddevice', urlencodedParser,function (req, res) {
  var Name = req.body.Dname
  var Info = req.body.info

  function Adddevicec(a1,a2) {
    con.connect(function(err) {
      if (err) throw err;
      //Select all customers and return the result object:
      var sql = "CREATE TABLE "+a1+" (id INT(255), "+a2+" VARCHAR(255))";
      con.query(sql,  function (err, result) {
        if (err) throw err;
        res.send("New device Added !");
      });
      var sql2 = "INSERT INTO `devicelist` (name,active,inactive) VALUES ('"+a1+"', 'true', 'true')";
      con.query(sql2, function (err, result) {
        if (err) throw err;
        res.send("New device Added !");
        
      });

    });
  }
  Adddevicec(Name,Info);
})
////// updata for app show
app.post('/apps', urlencodedParser,function (req, res) {
  var st = req.body.active
  function put(stval) {
    con.connect(function(err) {
      if (err) throw err;
      //Select all customers and return the result object:
      var sql = "UPDATE devicelist SET active = '"+stval+"' WHERE id = '1'";
      con.query(sql, function (err, result) {
        if (err) throw err;
        res.send("your devois is inactive");
      });
    });
  }
  put(st);
})
////// show app
app.get('/app',function (req, res) {

        res.render('app');

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})