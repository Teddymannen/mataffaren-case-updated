// backend
const express = require('express');
const app = express();
const port = 4000;

// proxy willys
app.get('/api/*', async (req, res) => {
  try {
    res.json(await (await fetch(`https://www.willys.se${req.url.slice(4)}`)).json())
  }
  catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// Category tree: /api/leftMenu/categorytree 
// Category list: /api/c/kott-chark-och-fagel/palagg?size=30&page=0&sort=
// [topRated, name-asc,name-desc,price-asc,price-desc,compareprice-asc,compareprice-desc]
// Product info:  /api/axfood/rest/p/101290312_ST

// start server
app.listen(port, () => console.log('Backend listening on port 4000'));