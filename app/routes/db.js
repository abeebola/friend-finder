var express = require('express'),
    router = express.Router(),
    url = 'mongodb://localhost:27017/friends_db',
    mongoClient = require('mongodb').MongoClient;

router.get('/db', function(req, res){
    // mongo.connect(url, function(err, db){
    //     if (err)
    //         throw err;
    //     console.log('database created..');
    //     res.send('Hello...');
    // });
    mongoClient.connect(url, function(err, db){
        var table = 'users';
        if (err)
            throw err;
        console.log(`Connected to database ${db_name}.`);
        db.createCollection(table, {strict:true}, function(err, res){
            var msg = 'This collection already exists..'; // Default response message
            if ( err){
                console.log('Collection already exists..\nSkipping import.');
                console.log(err);
            } else {
                console.log(`Collection '${table} created..'`);
                console.log('Importing dummy data');
                db.collection(table).insertMany(data, function(err, res){
                    if (err)
                        throw err;
                    console.log(`${res.insertedCount} records inserted`);
                });

            }
        });
        
        db.close();
    });
    // console.log(mongo);
    res.send('<h1>This is the db page!!</h1>');
});

module.exports = router;