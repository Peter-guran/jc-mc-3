const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connect() {

    // connect to database
    await client.connect();
    console.log("connected to database!");

    // create database and collection
    const db = client.db("mydb");
    const collection = db.collection("users");
    console.log("Database and collection created!");

    // Insert / Create new user
    const user = {name: "Emilia", age:49 }
    await collection.insertOne(user);
    console.log("Added user to collection!");

    // Find and count all users
    const users = await collection.find().toArray();
    console.log("Number of users:", users.length);

    // Count and find by filter
    const Peterses = await collection.find({ name: "Peter"}).toArray();
    console.log("Numbers of Peterses", Peterses.length);

    // Show first user in database
    const firstUser = users[0];
    console.log("First user name", firstUser.name);
    console.log("First user _id:", firstUser._id);

    // Find a user by _id
    const SelectedId = new ObjectId("6744452735a5e38307c18849")
    const selectedUser = await collection.findOne({ _id: SelectedId });
    console.log("Selected user name and age:", selectedUser.name, selectedUser.age);

    // Increses age and update user
    selectedUser.age++;
    await collection.updateOne({ _id: selectedUser._id }, { $set: selectedUser });
    console.log("Updated selected user");

    await client.close();
}

connect();