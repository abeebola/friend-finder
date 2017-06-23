var mongoClient = require('mongodb').MongoClient,
    db_name = 'friends_db',
    url = `mongodb://localhost:27017/${db_name}`;

const connect_to_mongo = () => {
    return mongoClient.connect(url)
}

module.exports = connect_to_mongo;