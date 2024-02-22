const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const list = ["Buy food.", "Cook food.", "Eat food.", "clearn dishes"];

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

    res.render("list", { kindOfDay: day, newListItems: list });
});

app.post("/", (req, res) => {
    let ne = req.body.newItem;
    list.push(ne);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is live on port 3000");
});
