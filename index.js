require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Equipment Store Server");
});

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.f3kdz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("EquiSports");
    const users = database.collection("users");
    const equipments = database.collection("equipments");
    const reviews = database.collection("reviews");
    const faqs = database.collection("faqs");
    const category = database.collection("category");

    // get all users
    app.get("/users", async (req, res) => {
      const cursor = users.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get single user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await users.findOne(query);
      res.send(result);
    });
    // Update a equipment
    app.put("/users", async (req, res) => {
      const newUser = req.body;
      const filter = { email: newUser.email };
      const options = { upsert: true };
      const equipment = {
        $set: {
          username: newUser.username,
          email: newUser.email,
        },
      };
      const result = await users.updateOne(filter, equipment, options);
      res.send(result);
    });

    // get all equipments
    app.get("/equipments", async (req, res) => {
      const cursor = equipments.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get single equipments
    app.get("/equipments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipments.findOne(query);
      res.send(result);
    });
    // add a equipments
    app.post("/equipments", async (req, res) => {
      const newEquipments = req.body;
      const result = await equipments.insertOne(newEquipments);
      res.send(result);
    });
    // get multiple for user email
    app.get("/equipments/filtered/:email", async (req, res) => {
      const userEmail = req.params.email;
      const query = { owner: userEmail };
      const cursor = equipments.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete a equipments
    app.delete("/equipments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipments.deleteOne(query);
      res.send(result);
    });

    // Update a equipment
    app.put("/equipments/:id", async (req, res) => {
      const id = req.params.id;
      const updatedEquipment = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const equipment = {
        $set: {
          image: updatedEquipment.image,
          itemName: updatedEquipment.itemName,
          categoryName: updatedEquipment.categoryName,
          description: updatedEquipment.description,
          price: updatedEquipment.price,
          rating: updatedEquipment.rating,
          customization: updatedEquipment.customization,
          processingTime: updatedEquipment.processingTime,
          stockStatus: updatedEquipment.stockStatus,
        },
      };
      const result = await equipments.updateOne(filter, equipment, options);
      res.send(result);
    });

    // reviews section
    // get all reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviews.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // add a review
    app.post("/reviews", async (req, res) => {
      const newReviews = req.body;
      const result = await reviews.insertOne(newReviews);
      res.send(result);
    });

    // faqs
    // get all faqs
    app.get("/faqs", async (req, res) => {
      const cursor = faqs.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get multiple for user email
    app.get("/faqs/filtered/:email", async (req, res) => {
      const userEmail = req.params.email;
      const pointer = { owner: userEmail };
      const cursor = faqs.find(pointer);
      const result = await cursor.toArray();
      res.send(result);
    });

    // add a faq
    app.post("/faqs", async (req, res) => {
      const newFaq = req.body;
      const result = await faqs.insertOne(newFaq);
      res.send(result);
    });

    // get all category
    app.get("/category", async (req, res) => {
      const cursor = category.find();
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
