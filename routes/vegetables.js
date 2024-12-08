const express = require("express");
const router = express.Router();
const Vegetable = require("../models/vegetables");

// localhost:5052/api/vegetables/seed this route gives and empty object
router.get("/seed", async (req, res) => {
  console.log("boo");
  try {
    await Vegetable.create([
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

// localhost:5052/api/vegetables this route gives and empty array
router.get("/", async (req, res) => {
  try {
    const foundVegetables = await Vegetable.find({});
    res.status(200).json(foundVegetables);
  } catch (err) {
    res.status(400).send(err);
  }
});

// localhost:5052/api/vegetables/:id this route does not work no id to try with yet
router.delete("/:id", async (req, res) => {
  try {
    const deletedVegetable = await Vegetable.findByIdAndDelete(req.params.id);
    console.log(deletedVegetable);
    res.status(200).json(foundVegetables);
  } catch (err) {
    res.status(400).send(err);
  }
});

// localhost:5052/vegetables/:id/edit this route does not work again no id yet to try with
router.put("/:id/edit", async (req, res) => {
  console.log(req.params.id);
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

// localhost:5052/api/vegetables this route shows same empty array
router.post("/vegetables", async (req, res) => {
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

// localhost:5052/api/vegetables/:id
router.get("/:id", async (req, res) => {
  try {
    const foundVegetable = await Vegetable.findById(req.params.id);
    res.json(foundVegetable).status(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
