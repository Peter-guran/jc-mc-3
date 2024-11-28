const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path"); // Behövs för att hantera filvägar
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Anslut till MongoDB
mongoose.connect("mongodb://localhost:27017/shop");

app.use(express.static("public"));

// Skapa MongoDB-scheman
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  product: String,
  quantity: Number,
});

// Skapa modeller
const Customer = mongoose.model("Customer", customerSchema);
const Order = mongoose.model("Order", orderSchema);

// Routes för API-funktionalitet
app.post("/add-customer", async (req, res) => {
  const { name, email } = req.body;
  try {
    const newCustomer = new Customer({ name, email });
    await newCustomer.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Kunde inte lägga till kunden");
  }
});

app.post("/add-order", async (req, res) => {
  const { customerId, product, quantity } = req.body;
  try {
    const newOrder = new Order({ customerId, product, quantity });
    await newOrder.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Kunde inte lägga till ordern");
  }
});

app.get("/customers-orders", async (req, res) => {
  try {
    const customers = await Customer.find();
    const orders = await Order.find().populate("customerId");
    res.json({ customers, orders });
  } catch (err) {
    res.status(500).send("Kunde inte hämta data");
  }
});

// === Lägg till route för startsidan här ===

// Alternativ 1: Servera en statisk HTML-fil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Se till att filen "index.html" finns i rotmappen
});

app.use(express.static(path.join(__dirname, "public")));
// === Slut på GET / route ===

// Starta servern
app.listen(3000, () => {
  console.log("Servern kör på http://localhost:3000");
});
