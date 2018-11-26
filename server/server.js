const express = require("express")
const _ = require("lodash")
const bodyParser = require("body-parser")
const {ObjectId} = require("mongodb")
const {mongoose} = require("./db/mongoose")
const {User} = require("./models/user")
const {Todo} = require("./models/todo")

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post("/todos", (req, res) => {
  let todo = new Todo(req.body)

  todo
    .save()
    .then((todo) => {
      res.status(200).send(todo)
    })
    .catch((e) => {
      res.status(400).send(e)
    })

})

app.get("/todos", (req, res) => {

  Todo.find().then(todos => {
    res.send({todos})
  }).catch((err) => {
    res.status(400).send({err})
  })
})

app.get("/todos/:id", (req, res) => {
  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({todo})
    })
    .catch((e) => {
      res.status(400).send()
    })
})

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndDelete(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({todo})
    })
    .catch((e) => {
      res.status(400).send()
    })
})

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ["text", "completed"])
  

  if (!ObjectId.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send({todo})
  }).catch((e) => {
    res.status(400).send()
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})

module.exports = { app }