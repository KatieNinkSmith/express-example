// first bring in express, which we already installed
// you can see it in your package.json
const express = require("express");
// create your application
const app = express();
// set port
const PORT = process.env.PORT || 5050;
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/conn");
const bodyParser = require("body-parser");
const jsxViewEngine = require("jsx-view-engine");
const methodOverride = require("method-override");

const Fruit = require("./models/fruits");
const Vegetable = require("./models/vegetables");

// set up the view engine to be able to use it
app.set("view engine", "jsx");
app.set("views", "./views");
app.engine("jsx", jsxViewEngine());

// ========== MIDDLEWARE ==========
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

const fruitsRouter = require("./routes/fruits");
const vegetablesRouter = require("./routes/vegetables");
app.use("/api/fruits", fruitsRouter);
app.use("/api/vegetables", vegetablesRouter);
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

// E - Edit
// localhost:5052/fruits/:id/edit this route works*******
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
