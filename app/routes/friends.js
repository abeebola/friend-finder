var express = require('express'),
    router = express.Router(),
    mongoClient = require('mongodb').MongoClient,
    db_name = 'friends_db',
    url = `mongodb://localhost:27017/${db_name}`,
    // Get connector to mongoDB
    db_conn = require('./../src/lib/mongo_conn'),
    ObjectId = require('mongodb').ObjectId;

router.get('/friends', function (req, res) {
    var cookie = req.cookies.ffc;
    db_conn()
        .then((db) => {
            var users = db.collection('users');
            if (typeof cookie !== 'undefined') {
                var userId = cookie;
                users.findOne({ _id: new ObjectId(userId) })
                    .then((user) => {
                        if (user) {
                            var matches = user.suggested_friends;
                            users.find({
                                name: {
                                    $in: matches
                                }
                            }).toArray((err, users) => {
                                if (err)
                                    throw err;
                                res.render('friends', {
                                    pageTitle: `Welcome to Friend Finder - There are ${users.length} matches.`,
                                    pageClass: 'friends',
                                    desc: 'Find friends who share the same interests as you.',
                                    matches: users,
                                    count: users.length,
                                    loggedIn: 1
                                });

                            });

                        } else res.json({ statusCode: 0, text: "This user does not exist." })

                    }).catch((error) => console.log(error));

            } else {
                users.find({})
                    .limit(30)
                    .sort({name: 1})
                    .toArray((err, users) => {
                        if (err)
                            throw err;
                        res.render('friends', {
                            pageTitle: `Welcome to Friend Finder.`,
                            pageClass: 'friends',
                            desc: 'Find friends who share the same interests as you.',
                            matches: users,
                            count: users.length,
                            loggedIn: 0
                        });

                    });
            }
        });

});

router.post('/friends', function (req, res) {

    db_conn()
        .then((db) => {
            var users = db.collection('users'),
                new_user = req.body,
                age = parseInt(new_user.age),
                query = {},
                suggested_friends = [];

            new_user.age = age;
            new_user.created = new Date().toJSON();
            new_user.preferences = JSON.parse(new_user.preferences);

            var prefs = new_user.preferences;

            for (var key in prefs) {
                if (prefs.hasOwnProperty(key)) {
                    if (key == 'hobbies') {
                        var hobbies_query = {};
                        hobbies_query["$in"] = prefs.hobbies;
                        query.hobbies = hobbies_query;
                    } else {
                        query[key] = prefs[key];
                    }

                }
            }

            users.find(query)
                .toArray((err, result) => {
                    if (!err) {
                        result.map((item) => {
                            suggested_friends.push(item.name);
                        });

                        new_user.suggested_friends = suggested_friends;

                        // Add new user
                        users.insertOne(new_user).then((result) => {
                            res.cookie('ffc', result.insertedId, {
                                maxAge: new Date().getUTCMilliseconds() + (60 * 60 * 24 * 365 * 1000)
                            })
                            res.json({ statusCode: 1, user_id: result.insertedId });
                        }).catch((error) => {
                            console.log(error);
                            res.json({ statusCode: 0 });
                        });
                    }

                });

        }).catch((err) => console.log(error));

});

module.exports = router;