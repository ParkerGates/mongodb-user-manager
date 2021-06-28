const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const {Data, DB} = require('./db/database');

let checkListing = false;
let curId = 0;
let searchName = "";
let searchFOrL = "";
let searchOrder = "";

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


//MAIN====================================================================
app.get("/", (req,res) => {
    res.render("index")
});


//ADD=====================================================================
app.get("/add", (req,res) => {
    res.render("add")
});

app.post("/add", (req,res) => {
    const newData = new Data();
    newData.firstName = req.body.firstName;
    newData.lastName = req.body.lastName;
    newData.email = req.body.email;
    newData.age = req.body.age;
    newData.save();
    res.redirect("listing")
});


//LISTING=================================================================
app.get("/listing/:name*?/:fOrL*?/:order*?", (req,res) => {
    if (checkListing === false) {
        Data.find({}, (err, data) => {
            let items = data;
            let length = lengthToString(data.length);
            res.render("listing", {
                items: items,
                itemNum: length,
            });
        });
    }
    else {
        let findData;
        checkListing = false;
        let findOrder = searchOrder === "ASC" ? 1 : -1;
        switch(searchFOrL) {
            case "firstName":
                if (searchName === "") { findData = {} }
                else { findData = { firstName: searchName }; }
                findOrder = { sort: {age: findOrder}};
                searchName = ""; searchFOrL = ""; searchOrder = "";
                postSelected(res,findData,findOrder);
                break;
            case "lastName":
                if (searchName === "") { findData = {} }
                else { findData = { lastName: searchName }; }
                findOrder = { sort: {age: findOrder}};
                searchName = ""; searchFOrL = ""; searchOrder = "";
                postSelected(res,findData,findOrder);
                break;
        }
    }
});

app.post("/listing", (req,res) => {
    checkListing = true;
    searchName = req.body.search;
    searchFOrL = req.body.by;
    searchOrder = req.body.order;
    res.redirect('listing')
});


//EDIT====================================================================
app.get("/edit/:editId", (req,res) => {
    let userId = req.params.editId;
    curId = userId;
    Data.find({ _id: userId }, (err, data) => {
        res.render("edit", {
            items: data[0]
        });
    });
});

app.post('/edit', (req,res) => {
    
    Data.deleteOne({ _id: curId }, (err) => {if (err) throw err});
    const newData = new Data();
    newData.firstName = req.body.firstName;
    newData.lastName = req.body.lastName;
    newData.email = req.body.email;
    newData.age = req.body.age;
    newData.save();
    res.redirect("listing")
});


//DELETE==================================================================
app.get('/delete/:deleteId', (req,res) => {
    let userId = req.params.deleteId;
    Data.deleteOne({ _id: userId }, (err) => {
        if (err) throw err;
        res.redirect('/listing');
    });
});



//LISTENING===============================================================
app.listen(port, () => {
    console.log(`Listening On Port: ${port}`)
})


//FUNCTIONS===============================================================
function lengthToString(length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(i);
    }
    return arr
}

function postSelected(res,search,sort) {
    Data.find(search, null, sort, (err, data) => {
        if (err) throw err;
        let items = data;
        let length = lengthToString(data.length);
        res.render("listing", {
            items: items,
            itemNum: length,
        });
    })
}
