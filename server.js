//==============================================================================
// set up server================================================================
//==============================================================================
const keys                = require('./config/keys')
const express             = require('express')
//const rateLimit           = require('express-rate-limit');
//const helmet              = require('helmet');
//const mongoSanitize       = require('express-mongo-sanitize');
//const xss                 = require('xss-clean');
//const hpp                 = require('hpp');
const app                 = express()
const PORT                = process.env.PORT || 5000;
const LOCAL               = keys.localPort;
const bodyParser          = require('body-parser')
//const compression         = require('compression');
//const cookieParser        = require('cookie-parser');
//const cors                = require("cors");
const session             = require('cookie-session')
const passport            = require('passport')
const mongoose            = require('mongoose')
//const path                = require("path");
let   server              = app
if (process.env.NODE_ENV !== 'production') {
  // Development logging
  const morgan = require('morgan');
  app.use(morgan('dev'));
}
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

//==============================================================================
// configuration ===============================================================
//==============================================================================
require('./models/users');
require('./models/place');
require('./models/memory');
require('./config/passport')(passport); // pass passport for configuration

// connect to our database
mongoose.Promise = global.Promise;
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
//app.use(cors());
//app.options('*', cors());

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
//app.use(bodyParser.json({
//	verify: (req, res, buf) => { req.rawBody = buf }
//})) 

//==============================================================================
// routes ======================================================================
//==============================================================================
require('./routes/auth.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/place.js')(app)
require('./routes/memory')(app)

//==============================================================================
// launch ======================================================================
//==============================================================================

server.listen(PORT, LOCAL, (err) =>{
if(!err){
    console.log('server started running on: ' + PORT);
    console.log('server NODE_ENV: ' + process.env.NODE_ENV);
} else {
    console.log('unable to start server');}
})
