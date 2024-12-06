// first bring in express, which we already installed
// you can see it in your package.json
const express = require("express");
// create your application
const app = express();
// set port
const PORT = process.env.PORT || 5050;
const dotenv = require("dotenv");
dotenv.config();
// import db/conn.js
const db = require("./db/conn");
// Import the body-parser package
const bodyParser = require("body-parser");
// in order to use the jsx view engine, i need to bring it in
const jsxViewEngine = require("jsx-view-engine");
// method-override is used to be able to do more than GET and POST
const methodOverride = require("method-override");
// you have to have a port defined so that the application has somewhere to listen

const Fruit = require("./models/fruits");
const Vegetable = require("./models/vegetables");

// set up the view engine to be able to use it
app.set("view engine", "jsx");
app.set("views", "./views");
app.engine("jsx", jsxViewEngine());

// ========== MIDDLEWARE ==========
// this is imported middleware, meaning that we are using code that someone else wrote
// we use the body-parser middleware first so that
// we have access to the parsed data within our routes.
// the parsed data will be located in req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static("public"));

// below is custom middleware, meaning that we wrote the code that we wanted to be executed
app.use((req, res, next) => {
  console.log("Middleware: I run for all routes");
  next();
});

app.use((req, res, next) => {
  const time = new Date();
  console.log(
    `-----
        ${time.toLocaleDateString()}: Received a ${req.method} request to ${
      req.url
    }.`
  );

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// ========== ROUTES ==========
// localhost:5052 this route works
app.get("/", (req, res) => {
  res.send("<div>this is my home</div>");
});
// localhost:5052/index this route works
app.get("/index", (req, res) => {
  res.send("<h1>This is an index</h1>");
});
// localhost:5052/fruits this route works technically
app.get("/fruits", async (req, res) => {
  try {
    const foundFruits = await Fruit.find({});
    res.status(200).render("fruits/Index", { fruits: foundFruits });
  } catch (err) {
    res.send(err).status(400);
  }
});
// localhost:5052/vegetables this route only shows "Create a New Vegetable",
// from index view even after tempting to seed
app.get("/vegetables", async (req, res) => {
  try {
    const foundVegetables = await Vegetable.find({});
    res.status(200).render("vegetables/Index", { vegetables: foundVegetables });
  } catch (err) {
    res.send(err).status(400);
  }
});

// add a seed route temporarily
// localhost:5052/api/fruits/seed this route works
app.get("/api/fruits/seed", async (req, res) => {
  try {
    await Fruit.create([
      {
        name: "grapefruit",
        color: "pink",
        readyToEat: true,
      },
      {
        name: "grapes",
        color: "purple",
        readyToEat: true,
      },
      {
        name: "apple",
        color: "green",
        readyToEat: false,
      },
      {
        name: "fig",
        color: "yellow",
        readyToEat: true,
      },
      {
        name: "grapes",
        color: "green",
        readyToEat: false,
      },
    ]);

    res.status(200).redirect("/api/fruits");
  } catch (err) {
    res.status(400).send(err);
  }
});
// localhost:5052/api/vegetables/seed this route gives and empty object
app.get("/api/vegetables/seed", async (req, res) => {
  try {
    await Vegetables.create([
      {
        name: "carrot",
        color: "orange",
        readyToEat: true,
      },
      {
        name: "broccoli",
        color: "green",
        readyToEat: true,
      },
      {
        name: "cabbage",
        color: "yellow",
        readyToEat: false,
      },
      {
        name: "spinach",
        color: "green",
        readyToEat: false,
      },
      {
        name: "pepper",
        color: "red",
        readyToEat: true,
      },
    ]);

    res.status(200).redirect("/api/vegetables");
  } catch (err) {
    res.status(400).send(err);
  }
});

// backend index of fruit
// localhost:5052/api/fruits this route works
app.get("/api/fruits", async (req, res) => {
  try {
    const foundFruits = await Fruit.find({});
    res.status(200).json(foundFruits);
  } catch (err) {
    res.status(400).send(err);
  }
});
// backend index of vegetables
// localhost:5052/api/vegetables this route gives and empty array
app.get("/api/vegetables", async (req, res) => {
  try {
    const foundVegetables = await Vegetable.find({});
    res.status(200).json(foundVegetables);
  } catch (err) {
    res.status(400).send(err);
  }
});

// N - NEW - allows a user to input a new fruit
// localhost:5052/fruits/new this route works goes to New route
app.get("/fruits/new", (req, res) => {
  // the 'fruits/New' in the render needs to be pointing to something in my views folder
  res.render("fruits/New");
});
// localhost:5052/vegetables/new this route gives {"error":"Resource not found"}
app.get("/vegetables/new", (req, res) => {
  res.render("vegetables/New");
});

// DELETE
// localhost:5052/api/fruits/:id this route works gives single id
app.delete("/api/fruits/:id", async (req, res) => {
  try {
    const deletedFruit = await Fruit.findByIdAndDelete(req.params.id);
    console.log(deletedFruit);
    res.status(200).json(foundFruits);
  } catch (err) {
    res.status(400).send(err);
  }
});
// localhost:5052/api/vegetables/:id this route does not work no id to try with yet
app.delete("/api/vegetables/:id", async (req, res) => {
  try {
    const deletedVegetable = await Vegetable.findByIdAndDelete(req.params.id);
    console.log(deletedVegetable);
    res.status(200).json(foundVegetables);
  } catch (err) {
    res.status(400).send(err);
  }
});

// UPDATE
// localhost:5052/fruits/:id/edit this workds and displays Edit view
app.put("/fruits/:id/edit", async (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  try {
    const updatedFruit = await Fruit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log(updatedFruit);
    res.redirect(`/api/fruits/${req.params.id}`);
  } catch (err) {
    res.send(err).status(400);
  }
});

// localhost:5052/vegetables/:id/edit this route does not work again no id yet to try with
app.put("/vegetables/:id/edit", async (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  try {
    const updatedVegetable = await Vegetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log(updatedVegetable);
    res.redirect(`/api/vegetables/${req.params.id}`);
  } catch (err) {
    res.send(err).status(400);
  }
});

// CREATE
// localhost:5052/api/fruits this route works realized the difference get/post
app.post("/api/fruits", async (req, res) => {
  //   console.log(req.body);
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  try {
    const createdFruit = await Fruit.create(req.body);
    res.status(200).redirect("/api/fruits");
  } catch (err) {
    res.status(400).send(err);
  }
});
// localhost:5052/api/vegetables this route shows same empty array
app.post("/api/vegetables", async (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  try {
    const createdVegetable = await Vegetable.create(req.body);
    res.status(200).redirect("/api/vegetables");
  } catch (err) {
    res.status(400).send(err);
  }
});

// E - Edit
// localhost:5052/fruits/:id/edit this route works put/get
app.get("/fruits/:id/edit", async (req, res) => {
  try {
    const foundFruit = await Fruit.findById(req.params.id);
    res.render("fruits/Edit", { fruit: foundFruit, id: req.params.id });
  } catch (err) {
    res.status(400).send(err);
  }
});
// localhost:5052/vegetables/:id/edit same same from put
app.get("/vegetables/:id/edit", async (req, res) => {
  try {
    const foundVegetable = await Vegetable.findById(req.params.id);
    res.render("vegetables/Edit", {
      vegetable: foundVegetable,
      id: req.params.id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// SHOW
// localhost:5052/api/fruits/:id same same from get/delete
app.get("/api/fruits/:id", async (req, res) => {
  try {
    const foundFruit = await Fruit.findById(req.params.id);
    res.json(foundFruit).status(200);
  } catch (err) {
    res.status(400).send(err);
  }
});
// localhost:5052/api/vegetables/:id
app.get("/api/vegetables/:id", async (req, res) => {
  try {
    const foundVegetable = await Vegetable.findById(req.params.id);
    res.json(foundVegetable).status(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Custom 404 (not found) middleware
app.use((req, res) => {
  console.log(
    "I am only in this middleware if no other routes have sent a response."
  );
  res.status(404);
  res.json({ error: "Resource not found" });
});

// have your application start and listen for requests
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
