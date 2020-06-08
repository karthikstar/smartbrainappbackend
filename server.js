// to initalise tbe package.json use npm init
// npm install express
// npm install nodemon under dev dependencies - uses npm install nodemon--save-dev

// plan how u wanna have your api to look like

// what routes do we want to have ?
// / --> res = 'this is working'

// /1. signin --> POST = success/fail (why post instead of get? because if we using get we will be passing in a query string which can be easily seen by nearby ppl)
// /2.register --> POST (as we wanna add the info to the database)  = user

// /profile/:userID --> GET = user
// /image --> PUT (update the score) --> updated user obj.




const express = require('express')
// const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex ({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl:true
  }
});
const register = require('./controllers/register')

const signin = require('./controllers/signin')

const profile = require('./controllers/profile')

const image = require('./controllers/image')

// to check if we have connected this server to our database succesfully.
// db.select('*').from('users').then(data => {
//   console.log(data)
// })


// knex builds our sql statement for us
// this console log was the query statement that knex created for postgres


// 127.0
const app = express()

app.use(express.json()) // its a middleware, helps to parse the responses in json format, to readable js format.
app.use(cors())


// using for loop and checking every item whether any matches the name is honestly q inefficient hence tts why we use databases as they can grab the info faster.
// we dont use variables to hold information because they dont persist eg if we refresh this file, the var database will get resetted to the two users.
// databases are good as they run on discs somewhere in the world and they are good in keeping info in tact and wouldnt lose them.



app.get('/',(req,res) =>{res.send('it is working')})

// SIGN IN

app.post('/signin', signin.handleSignin(db,bcrypt))
// this is advanced way of expressing the function
// first we run signin.handleSignin() w db and bcrpyt, and then it automatically receives req,res
// becomes signin.handleSignin(db,bcrypt)(req,res)

// register

app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt)})
// this is called a dependency injection as we are passin in the bcrpyt and db into this function


// getting a profile
app.get('/profile/:id',(req,res) => {profile.handleProfileGet(req,res,db)})
// the :id means whatever number eg 125 we type after /, it will be taken in as the id


// updating entries count using put
app.put('/image',(req,res) => {image.handleImage(req,res,db)})

app.post('/imageurl',(req,res) => {image.handleApiCall(req,res)})

app.listen(process.env.PORT || 3000, ()=>{
  console.log(`app is running on port ${process.env.PORT}`)
})
