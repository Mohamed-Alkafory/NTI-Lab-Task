const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

const readTodos = (callback) => {
  fs.readFile("./data.json", "utf8", (error, data) => {
    if (error) {
      if (error.code === "ENOENT") return callback(null, []); //file not found >> return empty array
      return callback(error);
    }
    callback(null, data ? JSON.parse(data) : []);
  });
};

//HELPER >> write all todos to data.json
const writeTodos = (todos, callback) => {
  fs.writeFile("./data.json", JSON.stringify(todos), callback);
};

//GET /todos?limit=10&skip=0 >> Return the todos with filters (defaults are limit 10 skip 0)
app.get("/todos", (req, res) => {
  readTodos((error, todos) => {
    if (error) return res.status(500).send("error reading data");
    //logic
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    res.send(todos.slice(skip, skip + limit));
  });
});

//GET /todos/:id >> Get one todo by id
app.get("/todos/:id", (req, res) => {
  readTodos((error, todos) => {
    if (error) return res.status(500).send("error reading data");
    const todo = todos.find((t) => t.Id == req.params.id);
    if (!todo) return res.status(404).send("todo not found");
    res.send(todo);
  });
});

//POST /todos >> Create new todo && return the new todo to the user
app.post("/todos", (req, res) => {
  //logic
  readTodos((error, todos) => {
    if (error) return res.status(500).send("error reading data");
    const newTodo = {
      Id: todos.length ? todos[todos.length - 1].Id + 1 : 1, //auto increment id
      title: req.body.title,
      status: "to-do", //default status
    };
    todos.push(newTodo);
    writeTodos(todos, (err) => {
      if (err) return res.status(500).send("error writing file");
      res.send(newTodo); //return the new todo
    });
  });
});

//PATCH /todos/:id >> Edit todo title by id
app.patch("/todos/:id", (req, res) => {
  readTodos((error, todos) => {
    if (error) return res.status(500).send("error reading data");
    const todo = todos.find((t) => t.Id == req.params.id);
    if (!todo) return res.status(404).send("todo not found");
    //logic
    todo.title = req.body.title;
    writeTodos(todos, (err) => {
      if (err) return res.status(500).send("error writing file");
      res.send(todo);
    });
  });
});

//DELETE /todos/:id >> Delete todo by id
app.delete("/todos/:id", (req, res) => {
  readTodos((error, todos) => {
    if (error) return res.status(500).send("error reading data");
    const newTodos = todos.filter((t) => t.Id != req.params.id);
    if (newTodos.length === todos.length)
      return res.status(404).send("todo not found");
    //logic
    writeTodos(newTodos, (err) => {
      if (err) return res.status(500).send("error writing file");
      res.send({ message: "todo deleted", deletedId: Number(req.params.id) });
    });
  });
});

app.listen(5000, () => {
  console.log(`my app listening on port 5000 successfully`);
});
