const handleSignin = (db,bcrypt) => (req,res) => {
// dependency injection of bcrypt and db
// this is a function that returns another function that returns the below stuff.

 // bcrypt.compare('apples', '$2a$10$Fu9j3lRvXGVvjsyjMA9FcuzbMA5QY9AEW.AjMCf6atzL7LsDd2m0u', function(err, result) {
 //   console.log('first guess',result) // result = true
 // });
 // bcrypt.compare('someOtherPlaintextPassword','$2a$10$Fu9j3lRvXGVvjsyjMA9FcuzbMA5QY9AEW.AjMCf6atzL7LsDd2m0u', function(err, result) {
 //   console.log('2nd guess',result) // result = false
 // });
 const {email,password} = req.body
 if (!email|| !password){
   return res.status(400).json('incorrect form submission')
 }

 db.select('email','hash').from('login')
   .where('email','=',email)
   .then(data => {
     const isValid = bcrypt.compareSync(password,data[0].hash)
     if(isValid){
       return db.select('*').from('users')
       .where('email','=',email)
       .then(user => {
         res.json(user[0])
       })
       .catch(err => res.status(400).json('unable to get user'))
     } else{
     res.status(400).json('wrong credentials')
   }
   })
   .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin : handleSignin
}
