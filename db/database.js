const mongoose = require('mongoose');
const dbURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/manager';




//SETUP===================================================================
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

const dbClient = mongoose.connection;
dbClient.on('error', console.error.bind(console, 'connection error:'));
dbClient.once('open', function () {
    console.log(`dbClient connected`);
});

const dataSchema = new mongoose.Schema({
    //id: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
});




//EXPORT==================================================================
const Data = mongoose.model('item', dataSchema);
module.exports = {
    Data: Data
};




//POPULATE================================================================
let fName = ["Abby","Ben","Cassie","Devin","Emily","Fred","Gabi","Hannah","Isabelle","Jason"];
let lName = ["Johnson","Johnson","Johnson","Gale","Free","Evans","Evans","Bends","Bends","Bends"];
let email = ["a@gmail.com","b@gmail.com","c@gmail.com","d@hotmail.com",
            "e@hotmail.com","f@hotmail.com","g@yahoo.com",
            "h@yahoo.com","i@yahoo.com","j@att.net"];
let age = [21, 23, 19, 17, 22, 21, 21, 25, 27, 23];


Data.deleteMany({}, (err) => {
    if (err) throw err;
    for (let i = 0; i < 10; i ++) {
        const newData = new Data();
        newData.firstName = fName[i];
        newData.lastName = lName[i];
        newData.email = email[i];
        newData.age = age[i];
        newData.save();
    }
});
