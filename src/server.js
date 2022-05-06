import express from "express";
import "dotenv/config";
import session from "express-session";
import db from "../models";
import morgan from "morgan";
import userRouter from "./routers/userRouter";
import consumerRouter from "./routers/consumerRouter";
import { localsMiddleware } from "./middlewares";
var MySQLStore = require("express-mysql-session")(session);

var options = {
  host: "localhost",
  port: 3300, //host, port 나중에 숨겨야 함
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
};

var sessionStore = new MySQLStore(options);

const app = express();

const logger = morgan("dev");

const PORT = 4000;

app.set("view engine", "html");
app.engine("html", require("ejs").renderFile); // temporarily using html only
app.set("views", process.cwd() + "/src/views");



app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for post request encoding

const handleListening = () => {
  console.log(`Server Listening on port: http://localhost:${PORT}`);
};

const doSync = async() => {
  try{
    await db.sequelize.sync().then((req) => {
      app.listen(PORT, handleListening);
    });
  } catch(err){
    console.log(err);
  }  
}

doSync();


app.use(
  session({
    secret: "session_cookie_secret", //나중에 .env에 hash 코드로 변경
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use("/static", express.static("assets"));
app.use(localsMiddleware);
app.use("/user", userRouter);
app.use("/consumer", consumerRouter)
