let express = require('express');
let app = express();
let morgan = require('morgan');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressValidator = require('express-validator');
let fs = require('fs');
let cors = require('cors');
let path = require('path');

dotenv.config()


let mongoUri, strPref
if (process.env.NODE_ENV === 'production'){
	strPref = '/api'
	mongoUri = process.env.MONGODB_DEPLOY_URI || 'mongodb+srv://user1:pass1@nodeapi-3ertg.mongodb.net/'//'mongodb://user1:pass1@ds259119.mlab.com:59119/heroku_f06273bq';
}
else{
	strPref = '/';
	mongoUri = process.env.MONGO_URI || 'mongodb+srv://user1:pass1@nodeapi-3ertg.mongodb.net/'
}

mongoose.connect(
  mongoUri,
  {useNewUrlParser: true,
   useUnifiedTopology: true}
)
.then(() => console.log('DB Connected'))
 
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});



//import routes
let postRoutes = require('./routes/post');
let authRoutes = require('./routes/auth');
let userRoutes = require('./routes/user');
//apiDocs
app.get(strPref, (req, res) => {
	fs.readFile('docs/apiDocs.json', (err, data) => {
		if (err){
			res.status(400).json({
				error: err
			});
		}
		let docs = JSON.parse(data);
		res.json(docs);
	})
})

// middlewares
app.use(morgan('dev'));

app.use(cors());

app.use(bodyParser.json());

app.use(cookieParser());

app.use(expressValidator());

app.use(strPref, postRoutes);

app.use(strPref, authRoutes);

app.use(strPref, userRoutes);

app.use(function (err, req, res, next){
	if (err.name === "UnauthorizedError") {
		res.status(401).json({ error : "Unauthorized!"});
	}
});

if (process.env.NODE_ENV === 'production') {
	//set static folder
	app.use(express.static('client/build'))
	/*app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})*/
}

let port = process.env.PORT || 8080;

app.listen(
	port, () => {
		console.log(`Node js api is listening on port: ${port}`);
	}

);