const express = require('express'); //This is importing express
const mongoose = require('mongoose'); //This is importing Mongoose library to help interact with MongoDB
const cors = require('cors'); //CORS == Cross Origin Resource Sharing, allows frontend requests from different domains
require('dotenv').config(); //This is loading in environmental variables

const app = express(); //This creates an express application instance
const PORT = process.env.PORT || 5001; //Defines the port for the server (5001) if PORT is defined in .env then it'll use that value otherwise use 5001 as a default

app.use(cors()); //Enables CORS on the express app, important when frontend and backend are on diff ports or domains, it connect them.
//By default browsers block requests made from different origins other than the servers, this allows it
app.use(express.json()); //Enables parsing of JSON data from incoming requests, needed since MongoDB stores data in JSON like format (BSON)

mongoose.connect(process.env.MONGO_URI, { //This connects the MongoDB databsase using URI from .env
}).then(() => console.log('MongoDB connected')) //If the connection is successful THEN log "MongoBD connected"
  .catch(err => console.log(err)); //If not then log the error in console

// Import and use the auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// store responses in MongoDB
const ResponseSchema = new mongoose.Schema({
  responses: [String], 
  date: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", ResponseSchema);

router.post("/saveResponses", async (req, res) => {
  try {
    const { userId, responses } = req.body;
    const newResponse = new Response({ userId, responses });
    await newResponse.save();
    res.json({ message: "Responses saved!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving responses" });
  }
});

// Fetch past responses for a user
router.get("/getResponses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userResponses = await Response.find({ userId }).sort({ date: -1 }).limit(1);
    if (userResponses.length > 0) {
      res.json(userResponses[0].responses);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching responses" });
  }
});

app.get('/', (req, res) => { // app.get() defines a route that listens for GET requests, '/' means the route is the root, (req, res) is a call back func that handles the request
  // A route in Express determines how the server responds when a user visits a specific URL.
  res.send('Hello Amanda!');
});

app.listen(PORT, () => { //Starts the server and listens for incoming requests on the defined PORT.
  console.log(`Server running on port ${PORT}`);
});

/*
  app.listen(PORT, callback)
	•	app.listen() is an Express method that starts the HTTP server.
	•	It tells the app to “listen” for incoming network requests.
	•	PORT specifies which port the server should run on.
	•	The callback function runs once the server starts.
*/