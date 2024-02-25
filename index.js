const express = require('express')
const app = express()
const port = 3100

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

var requestTime = function (req, res, next) {
  let today = new Date();
  let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

  req.requestTime = today.toLocaleDateString("uz-UZ", options).replaceAll('/', '-');
  next();
};
app.use(requestTime);

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(bodyParser());
app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.get('/', (req, res) => {
  var lines = process.stdout.getWindowSize()[1];

  res.send({ msg: '<h1>333</h1>' })
})

app.get('/req-time', (req, res) => {
  var responseText = 'Hello World!';
  responseText += 'Requested at: ' + req.requestTime + '';
  res.send(responseText);
})

app.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
});

let usersId = [1, 2, 3, 4, 5]
app.get('/user/:id', function (req, res, next) {
  if (usersId.includes(Number(req.params.id))) {
    res.send(req.params.id);
  }
  // else {
  //   res.send('mda: ' + req.params.id);
  //   usersId.push(req.params.id)
  // }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})