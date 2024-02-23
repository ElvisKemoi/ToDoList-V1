const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const date = require(__dirname+"/date.js")




const workItems = [];
const list = ["Buy food.", "Cook food.", "Eat food.", "clearn dishes"];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    let day = date.getDate();
    res.render("list", { listTitle: day, newListItems: list });
    
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work", newListItems: workItems });
});

app.get("/about", (req,res)=>{
    res.render("about");
})

app.post("/", (req, res) => {
    let item = req.body.newItem;
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        list.push(item);
        res.redirect("/");
    }
});

app.listen(3000, () => {
    console.log("Server is live on port 3000");
});
