const express = require('express');
const proxy = require('./proxy');
const short = require('short-uuid');
const path = require('path');
const app = express();
const { json } = require('body-parser');

console.log('Serving static asserts from .')
app.use(express.static(path.join(__dirname, '.')));
app.use(json({type: 'application/vnd.mcash.api.merchant.v1+json'}));

proxy(app);

const history = [];

app.get('/callback', function(req, res) {
  const id = short.generate();
  console.log('-------------------------')
  console.log(id);
  console.log('Serving request for history')

  res.json({ "callback_history": history.slice(0, 10) });
});

app.post('/callback', function(req, res) {
  const id = short.generate();
  console.log('-------------------------')
  console.log(id);
  console.log(req.method, req.url)
  console.log(req.headers)
  console.log(req.body);

  history.unshift({id, body: req.body})

  res.sendStatus(200);
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '.', 'index.html'));
});

const port = 3000
console.log(`Listening to 0.0.0.0:${port}`)
app.listen(port);