import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//update the password field.
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "TodoDB",
  password: "yourPassword",
  port: 5432,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    let result = await db.query("SELECT * FROM todo ORDER BY id DESC");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/add", async (req, res) => {
  let item = req.body.newItem;
  //console.log(item);
  if (!item) {
    res.redirect("/");
  } else {
    const modifiedItem = item.substring(0, 25);
    try {
      let result = await db.query(
        "INSERT INTO todo (title) VALUES ($1) RETURNING *",
        [modifiedItem]
      );
      //items = result.rows;
      //console.log("Item inserted into the table : " + items[0].title);
      // items.push({ title: item });
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const item = req.body.updatedItemTitle;
  try {
    let result = await db.query(
      "UPDATE todo SET title = $1 WHERE id = $2 returning *",
      [item, id]
    );
    //console.log("Item updated with values : " + result.rows[0].title);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    let result = await db.query("DELETE FROM todo WHERE id = $1 RETURNING *", [
      id,
    ]);
    //console.log("Item deleted : " + result.rows[0].title);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
