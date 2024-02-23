const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const list = ["Buy food.", "Cook food.", "Eat food.", "clearn dishes"];
const workItems = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    let day = today.toLocaleDateString("en-US", options);

    res.render("list", { listTitle: day, newListItems: list });
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work", newListItems: workItems });
});

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
