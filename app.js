const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const mongoose = require("mongoose ");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = mongoose.Schema({
	name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
	name: "Welcome to your todo list",
});
const item2 = new Item({
	name: "Hit the + button to add an item.",
});
const item3 = new Item({
	name: "<-- Hit this checkbox to delete ",
});

const defaultItems = [item1, item2, item3];

async function saveItems() {
	try {
		const result = await Item.insertMany(defaultItems);
		console.log(result);
	} catch (error) {
		console.error("Error saving items:", error);
	}
}

async function getTheList() {
	const items = await Item.find();
	console.log(items);
}
// getTheList();

// saveItems();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
	try {
		const list = await Item.find();
		// console.log(list);
		res.render("list", { listTitle: "Today", newListItems: list });
	} catch (error) {
		console.error("There was an error reading the document" + error);
	}
	// const list = await Item.find();
	// res.render("list", { listTitle: "Today", newListItems: list });
});

app.get("/work", (req, res) => {
	res.render("list", { listTitle: "Work", newListItems: workItems });
});

app.get("/about", (req, res) => {
	res.render("about");
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
