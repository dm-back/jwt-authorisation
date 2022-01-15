const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dm:shariki56@cluster0.jxmaa.mongodb.net/regist?retryWrites=true&w=majority"
    );
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
