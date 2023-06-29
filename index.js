const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const connectRedis = require("connect-redis");
let RedisStore = connectRedis.default;
const cors = require("cors");

const { 
  MONGO_USER, 
  MONGO_PASSWORD, 
  MONGO_IP, 
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET
} = require("./config/config");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("Successfully connected to DB"))
    .catch((e) => {
      console.log(e)
      setTimeout(connectWithRetry, 5000)
    })
};

//middlewares
app.enable("trust proxy");
app.use(cors({}));
app.use(
  session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 3600000
    }
}));
app.use(express.json());
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/api/v1", (req, res) => {
   res.send("<img src='https://i.pinimg.com/originals/82/d4/f8/82d4f8f8d7672bc5960d37dfcc51285f.jpg' style='width: 300px; height: auto;'></br></br><h1>Shaka zoom zoom</h1>");
   console.log("It runs");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectWithRetry();
  console.log(`Listening on port ${port}`)
});
