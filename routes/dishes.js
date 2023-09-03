var express = require('express');
var router = express.Router();
const CyclicDB = require('@cyclic.sh/dynamodb');
const db = CyclicDB(process.env.CYCLIC_DB);
let dishes = db.collection('dishes');

//Adds a new dish to the database.

router.post('/', async function(req, res, next) {
  const {dish, name, country} = req.body;
  await dishes.set(dish, {
    name: name,
    country: country
  })
  res.end();
});

//Gets a list of all the dishes.

router.get('/', async function(req, res, next) {
    let list = await dishes.list();
    res.send(list);
  });

//Gets details of dishes of the provided key.

router.get('/:key', async function(req, res, next) {
    let item = await dishes.get(req.params.key);
    res.send(item);
  });

module.exports = router;