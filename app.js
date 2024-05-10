const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const _ = require("lodash");
// const mongoose = require("mongoose ");

const mongoose = require("mongoose");

// mongoose.connect();

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

const listSchema = mongoose.Schema({
	name: String,
	items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

async function saveItems() {
	try {
		const result = await Item.insertMany(defaultItems);

		console.log("Successfully saved " + defaultItems.length + " items");
	} catch (error) {
		console.error("Error saving items:", error);
	}
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
	try {
		const list = await Item.find();
		if (list.length === 0) {
			saveItems();
			res.redirect("/");
		} else {
			res.render("list", { listTitle: "Today", newListItems: list });
		}
		// console.log(list);
	} catch (error) {
		console.error("There was an error reading the document" + error);
	}
	// const list = await Item.find();
	// res.render("list", { listTitle: "Today", newListItems: list });
});

app.get("/:customListName", async (req, res) => {
	const customListName = _.capitalize(req.params.customListName);

	const exists = await List.findOne({ name: customListName });

	if (exists === null) {
		const list = new List({
			name: customListName,
			items: defaultItems,
		});
		list.save();
		console.log("Item saved");
		res.redirect("/" + customListName);
	} else {
		console.log("It exists");
		res.render("list", {
			listTitle: exists.name,
			newListItems: exists.items,
		});
	}
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.post("/", async (req, res) => {
	const itemName = req.body.newItem;
	const listName = req.body.list;
	const item = new Item({
		name: itemName,
	});
	if (listName === "Today") {
		item.save();
		res.redirect("/");
	} else {
		const foundList = await List.findOne({ name: listName });
		foundList.items.push(item);
		foundList.save();
		res.redirect("/" + listName);
	}

	// const item = new Item({
	// 	name: itemName,
	// });
	// try {
	// 	item
	// 		.save()
	// 		.then(console.log("One document was inserted into the database"));
	// } catch (error) {
	// 	console.errror("Error: " + error);
	// }

	// res.redirect("/");
});

app.post("/delete", async (req, res) => {
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;
	console.log(listName, checkedItemId);
	if (listName === "Today") {
		try {
			await Item.findByIdAndDelete(checkedItemId);
			console.log("The Item was removed from the database");
			res.redirect("/");
		} catch (error) {
			console.error("Error: " + error);
		}
	} else {
		try {
			await List.findOneAndUpdate(
				{ name: listName },
				{ $pull: { items: { _id: checkedItemId } } }
			);
			console.log("Item removed successfully");
			res.redirect(`/${listName}`);
		} catch (error) {
			console.error("Error removing item:", error);
		}
	}
});

app.listen(3000, () => {
	console.log("Server is live on port 3000");
});
