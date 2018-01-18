const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotdev =  require('dotenv');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const ObjectID = require('mongodb').ObjectID;

const app = express();
dotdev.config();

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


//mongodb scripts /start
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("task");
    insertUser(dbo,'Bob', 'male');
    updateUserName(dbo, '5a60591d0842ec0bf0aa74d9', 'Alice');
    getUsernames(dbo);
    returnsOnlyFemaleUsers(dbo);
    updateAllTasksCompletedFalse(dbo);
    deleteAllTasksCompletedTrue(dbo);
    allTasksOfUserSortedCreatedDateNotCompleted(dbo, '5a60591d0842ec0bf0aa74d9');
    db.close();
});

function insertUser(dbo, username, gender) {
    const insertObj = { username: username, gender: gender };
    dbo.collection("users").insertOne(insertObj, (err, res) => {
        if (err) throw err;
        console.log("1 document inserted");
    });
}
function updateUserName(dbo, _id, username) {
    const findQuery = { _id: ObjectID(_id) };
    const newName = { $set: { username: username }};
    dbo.collection("users").updateOne(findQuery, newName, (err, res) => {
        if (err) throw err;
        console.log("1 document updated");
    });
}

function getUsernames(dbo) {
    dbo.collection("users").find({},{'_id': false, username: true,  'gender': false}).sort({ username: +1 }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
    });
}
function  returnsOnlyFemaleUsers(dbo) {
    dbo.collection("users").find({gender: 'female'}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
    });
}
function insertTask(dbo, user_id, title, text, completed, created, updated) {
    dbo.collection("tasks").insertOne({ user_id, title, text, completed, created, updated }, (err, res) => {
        if (err) throw err;
        console.log("1 documents inserted");
    });
}
function updateAllTasksCompletedFalse(dbo) {
    dbo.collection("tasks").update({}, {completed: false}, (err, res) => {
        if (err) throw err;
        console.log("documents updated");
    });
}
function deleteAllTasksCompletedTrue(dbo) {
    dbo.collection("tasks").deleteMany({completed: true}, (err, res) => {
        if (err) throw err;
        console.log("document deleted");
    });
}
function  allTasksOfUserSortedCreatedDateNotCompleted(dbo, user_id) {
    dbo.collection("tasks").find({completed: false, user_id}).sort({created: +1 }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
    });
}

//mongodb scripts /end

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});