const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
const authentication = require("./routers/authRoutes");
const productRoutes = require("./routers/productRoutes");
const connectDB = require("./configs/dbConnection");
const PORT = process.env.PORT || 5000;


const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
dotenv.config();


connectDB();

app.use("/api/auth", authentication);
app.use("/api/product", productRoutes)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});