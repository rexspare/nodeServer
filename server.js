require('dotenv').config()
const path = require('path')
const express = require('express');
const cors = require('cors')
const { logEvents, logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentails');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const app = express()
const PORT = process.env.PORT || 3500;

// Conect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// custom middlerware to allow Access-Control-Allow-Credential
app.use(credentials)

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data in other words formdata
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json())

// custom middleware for cookies
app.use(cookieParser())

// built-in middleware tp serve static files
app.use(express.static(path.join(__dirname, '/public')))

// OUR ROUTERS
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))

// TOKEN AUH
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))
app.use('/users', require('./routes/api/users'))

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: "404 error message" })
    } else {
        res.type('txt').send('404 error message')
    }
})

// ERROR HANDLING middleware
app.use(errorHandler)

// ALL ABOVE ANONYMOUS FUNCTIONS IN REQUESTS ARE ROUTE HANDLERS
// ANYTHING BETWEEN REQUEST AND RESPONSE IS A MIDDLE WARE

mongoose.connection.once('open', () => {
    console.log("Conected to MongoDB")
    app.listen(PORT, () => console.log(`Server running at PORT: ${PORT}`))
})

