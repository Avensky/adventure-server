//==============================================================================
// set up server================================================================
//==============================================================================
//const aws 		          = require('aws-sdk')
const keys                = require('./config/keys')
const express             = require('express')
//const rateLimit           = require('express-rate-limit');
//const helmet              = require('helmet');
//const mongoSanitize       = require('express-mongo-sanitize');
//const xss                 = require('xss-clean');
//const hpp                 = require('hpp');
const app                 = express()
const PORT                = process.env.PORT || 5000;
//const LOCAL               = "127.0.0.1";
//const LOCAL               = "192.168.1.14";
const LOCAL               = "192.168.100.7";
const bodyParser          = require('body-parser')
//const compression         = require('compression');
//const cookieParser        = require('cookie-parser');
const cors                = require("cors");
const session             = require('cookie-session')
const passport            = require('passport')
const mongoose            = require('mongoose')
//const multer              = require("multer");
//const multerS3 		      = require('multer-s3')
//const s3 		          = new aws.S3({apiVersion: '2006-03-01'});
const path                = require("path");
//const shopController      = require("./controllers/shopController");
let   server              = app


if (process.env.NODE_ENV !== 'production') {
  // Development logging
  const morgan = require('morgan');
  app.use(morgan('dev'));

}

//==============================================================================
// configuration ===============================================================
//==============================================================================
require('./models/users');
require('./models/place');
require('./config/passport')(passport); // pass passport for configuration

mongoose.Promise = global.Promise;// connect to our database
mongoose.connect(keys.mongoURI, { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true 
})
  .then(connect => console.log('connected to mongodb'))
  .catch(err => console.log('could not connect to mongodb', err))
module.exports = {mongoose}

// set up cors to allow us to accept requests from our client
app.use(cors());
app.options('*', cors());

// required for passport
app.use(session({ 
  secret: 'secret',   // session secret
  resave: false,
  saveUninitialized: false, 
  cookie: {
      maxAge: 30*24*60*60*1000,
  }
})); 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// get information from html forms raw
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
	verify: (req, res, buf) => { req.rawBody = buf }
})) 

//==============================================================================
// routes ======================================================================
//==============================================================================
require('./routes/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/place.js')(app)
//==============================================================================
// launch ======================================================================
//==============================================================================
if (process.env.NODE_ENV === 'production') {
// Express will serve up production assets
// like our main.js file, or main.css file!
app.use(express.static('../client/build'));

// Express will serve up the index.html file
// if it doesn't recognize the route
const path = require('path');
const filepath = path.join(__dirname, '../client/build/index.html');

app.get('*', (req, res) => {
    res.sendFile(filepath, function(err){
        if (err) {
            return res.status(err.status).end();
        } else {
            return res.status(200).end();
        }
    })

});
}


server.listen(PORT, LOCAL, (err) =>{
if(!err){
    console.log('server started running on: ' + PORT);
    console.log('server NODE_ENV: ' + process.env.NODE_ENV);
} else {
    console.log('unable to start server');}
})
