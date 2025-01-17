const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");

const cors = require("cors");
const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// gym_server
// uA8czFgGzHp7Jx7x

// const uri = "mongodb://localhost:27017";

const uri =
  "mongodb+srv://gym_server:uA8czFgGzHp7Jx7x@cluster0.j5yqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    console.log("db-connect");

    const gymSchedule = client.db("gym-scheduleDB").collection("schedule");
    // const userCollection = client.db("gym-scheduleDB").collection("users");

    app.get("/schedule", async (req, res) => {
      const { searchParams } = req.query;
      // console.log(searchParams);

      let option = {};

      if (searchParams) {
        option = { title: { $regex: searchParams, $options: "i" } };
      }

      const result = await gymSchedule.find(option).toArray();
      res.send(result);
    });

    app.post("/schedule", async (req, res) => {
      const data = req.body;
      console.log(data);

      const result = await gymSchedule.insertOne(data);
      res.send(result);
    });

    app.delete("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymSchedule.deleteOne(query);
      res.send(result);
    });

    app.get("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymSchedule.findOne(query);
      res.send(result);
    });

    app.patch("/schedule/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };

      const update = {
        $set: {
          title: data?.title,
          day: data?.day,
          date: data?.date,
          // hour: data?.hour,
        },
      };

      const result = await gymSchedule.updateOne(query, update);
      res.send(result);
    });

    app.patch("/status/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const update = {
        $set: {
          isCompleted: true,
        },
      };

      const result = await gymSchedule.updateOne(query, update);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", async (req, res) => {
  res.send(`server running on ${port}`);
});
app.listen(port, () => {
  console.log("server running");
});

//----------------------------------------------------------------
// const gymSchedule = client.db("gym-schedule").collection("schedule");

// app.post("/schedule", async (req, res) => {
//   const scheduleData = req.body;

//   // console.log(Object.keys(scheduleData));

//   if (Object.keys(scheduleData).length == 0) {
//     res.send("provide your data");
//   } else {
//     const result = await gymSchedule.insertOne(scheduleData);
//     res.send(result);
//   }
// });
// app.get("/schedule", async (req, res) => {
//   const { searchParams } = req.query;

//   console.log(searchParams);

//   let option = {};

//   if (searchParams) {
//     option = { title: { $regex: searchParams, $options: "i" } };
//   }
//   const result = await gymSchedule.find(option).toArray();
//   res.send(result);
// });
// app.delete("/schedule/:id", async (req, res) => {
//   const { id } = req.params;
//   const result = await gymSchedule.deleteOne({ _id: new ObjectId(id) });
//   res.send(result);
// });

// app.get("/schedule/:id", async (req, res) => {
//   const { id } = req.params;

//   console.log(id);

//   const filter = { _id: new ObjectId(id) };
//   const result = await gymSchedule.findOne(filter);
//   res.send(result);
// });

// app.patch("/schedule/:id", async (req, res) => {
//   const { id } = req.params;

//   console.log(id);
//   const data = req.body;

//   const filter = { _id: new ObjectId(id) };
//   const result = await gymSchedule.updateOne(filter, {
//     $set: {
//       title: data.title,
//       day: data.day,
//       formattedDate: data.formattedDate,
//     },
//   });
//   res.send(result);
// });
// app.patch("/status/:id", async (req, res) => {
//   const { id } = req.params;
//   const data = req.body;

//   console.log(data, id);

//   const filter = { _id: new ObjectId(id) };
//   const result = await gymSchedule.updateOne(filter, {
//     $set: {
//       isCompleted: data.isCompleted,
//     },
//   });
//   res.send(result);
// });
//----------------------------------------------------------------
