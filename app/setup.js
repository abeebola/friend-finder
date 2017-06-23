var db_name = 'friends_db',
    url = `mongodb://localhost:27017/${db_name}`,
    mongoClient = require('mongodb').MongoClient,
    data = require('./data/dummy.json');

    mongoClient.connect(url, function(err, db){
        var table = 'users';
        if (err)
            throw err;
        console.log(`Connected to database '${db_name}'.`);
        db.createCollection(table, {strict:true}, function(err, res){
            if ( err){
                console.log('Collection already exists..\nSkipping import.');
                console.log(err);
                db.close();
            } else {
                console.log(`Collection '${table}' created..`);
                console.log('Importing dummy data...');
                db.collection(table).insertMany(data
                ).then(function(result){
                    console.log(`${result.insertedCount} records inserted`);
                    db.close();
                });

            }
        });
    });