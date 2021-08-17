var express = require('express')
var router = express()

router.get('/', (req, res) => {
    console.log('here');
    res.send('Hello');
})

module.exports = router;