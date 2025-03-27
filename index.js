const http = require('http')
const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors());
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('dist'))
app.use(express.json())
// app.use(requestLogger)
let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World1!</h1>')
  })
  
app.get('/api/notes', (request, response) => {
    response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  }

  notes = notes.concat(note)

  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end("deleted")
})

app.put('/api/notes/:id',(req,res)=>{
  const body = req.body;
  const id = req.params.id;
  let isfound = 0;
   notes = notes.map(note=>{
    if(note.id===id){
      isfound =1;
      return body;
    }
    return note;
  })
  if(isfound===1)
  {
    res.json(body);
  }
  res.status(404).end();

})
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)