var express = require('express'),
    router = express.Router();

router.get('/', function(req, res){
    res.render('index', {
        pageTitle: 'Welcome to Friend Finder.',
        pageClass: 'home trans-header',
        desc: 'Find friends who share the same interests as you.'
    });
    // res.send('<h1>This is the index page!!</h1>');
});

module.exports = router;