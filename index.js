const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')


app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('tiny :body'))


let phonebook = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = phonebook.length > 0 ? Math.max(...phonebook.map(person => Number(person.id))) : 1

    return maxId + 1
}

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const foundEntry = phonebook.find(person => person.id === id)

    if (foundEntry) {
        response.status(200).json(foundEntry)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log('body: ', body)

    const findDuplicate = phonebook.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Invalid request body"
        })
    }

    if (findDuplicate) {
        return response.status(400).json({
            error: "That person was already created"
        })
    }

    const newPerson = {
        ...body,
        id: generateId()
    }

    console.log("phonebook length before add:", phonebook.length)
    phonebook = [...phonebook, newPerson]
    console.log("phonebook length after add:", phonebook.length)
    response.status(201).json(newPerson)
})

app.get('/info', (request, response) => {
    response.send(`<div><p>The phonebook has info for ${phonebook.length} people</p><p>${new Date()}</p></div>`)
})

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`Listening on port ${3000}`)
