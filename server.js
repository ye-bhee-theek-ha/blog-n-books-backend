
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");

const Routes = require("./Routes/Routes");

const { NotFound, errHandler } = require("./middlewares/errorMiddleware");

const bodyParser = require('body-parser');

const app = express();

var cors = require('cors')
app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

connectDB();
app.use(express.json());


app.get("/", (req, res) => {
    res.send("API is running...")
})

app.use("/api", Routes)


app.use(NotFound);
app.use(errHandler);

const PORT = process.env.PORT || 4000;

app.listen(5000, console.log(`server started on port ${PORT}`))