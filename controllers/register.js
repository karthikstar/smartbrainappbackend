const handleRegister = (req,res,db,bcrypt) => {
  const {email , name , password} = req.body

// means if either email or name or password is empty,(which sets to true),raise an err.
  if (!email || !name || !password){
    return res.status(400).json('incorrect form submission')
  }
  // the return statement will end the execution of the whole function hence the below will never get run.
  const hash = bcrypt.hashSync(password);

// password gets hashed to hash format. usually passwords which are same have same hash but bcrypt smart enugh to make them uniique from each other.
// THIS IS A transaction. te transaction is used to ensure that our particulars we submitted during registration gets enterd into the login table and the users table.
    db.transaction(trx => {
      trx.insert({
        hash:hash,
        email:email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
          email:loginEmail[0],
          name:name,
          joined: new Date()
        })
        .then(user =>{
          res.json(user[0])
        })

      })
      .then(trx.commit) // IMPT! w/o this we wont be committing the transaction!
      .catch(trx.rollback)
    })

  .catch(err => res.status(400).json('unable to register'))
}

//ALWAYS REMEMBER TO SEND A RESPONSE or else the client will be waiting for a resp the whole time


module.exports = {
  handleRegister:handleRegister

}
