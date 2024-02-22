const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const list = ["Buy food.", "Cook food.", "Eat food.", "clearn dishes"];

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    var day = today.toLocaleDateString("en-US", options);

    res.render("list", { kindOfDay: day, newListItems: list });
});

app.post("/", (req, res) => {
    var ne = req.body.newItem;
    list.push(ne);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is live on port 3000");
});
