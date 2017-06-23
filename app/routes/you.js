var express = require('express'),
    router = express.Router();

router.get('/you', function(req, res){
    res.render('you', {
        pageTitle: 'Welcome to Friend Finder.',
        pageClass: 'you',
        desc: 'Find friends who share the same interests as you.'
    });
    // res.send('<h1>This is the index page!!</h1>');
});

module.exports = router;