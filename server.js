const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const port = 8001;
const app = express();

// importing routes //
const itemsRoutes = require('./routes/itemsRoutes.js');
const usersRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const serviceRoutes = require('./routes/serviceRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');


// connecting mongodb //
const dbUrl = process.env.MY_DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
  
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// creating Middleware //
app.use(express.json());
app.use(cookieParser());


// routes //
app.use('/', itemsRoutes);
app.use('/users', usersRoutes);
app.use('/products', productRoutes);
app.use('/services', serviceRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);


app.all("*", (req, res) => {
    return res.status(400).json({
        message: "Hitting Wrong End-Point"
    })
});


// server listening at port 8001 //
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

