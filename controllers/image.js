const Clarifai = require('clarifai')
//adding a API KEY
const app = new Clarifai.App({
 apiKey: 'cceef3bc04f74ea8bd6f7db28ee09e81'
})
// this is at the backend as we want to hide the autthetnication key for clairfiaiai
// check network tab of browser whn u submit a url. if this was in front end, autthetnication key would have been visible to all.

const handleApiCall = (req,res) => {
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
  .then(data =>{
    res.json(data)
  })
  .catch(err => res.status(400).json('unable to work w API'))
}


const handleImage = (req,res,db) => {
  const {id} = req.body
  db('users').where('id','=',id)
  .increment('entries',1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0])
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall

}
