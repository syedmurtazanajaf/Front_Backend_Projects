const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todos");

const TodoSchema = new mongoose.Schema({
  text: String,
});


const Todo = mongoose.model("Todo", TodoSchema);

app.get("/todos", async( req, res)=>{

  const todos = await Todo.find();
  res.json(todos);

});

app.post("/todos", async (req, res)=>{

    const todo = new Todo({text: req.body.text});
    await todo.save();
    res.json(todo);
});


app.delete("/todos/:id", async (req, res)=>{
  const deleted = await Todo.findByIdAndDelete(req.params.id)
  res.json(deleted)
});

app.put("/todos/:id", async (req, res)=>{
  const updated = await Todo.findByIdAndUpdate(req.params.id, {text: req.body.text}, {new: true})
  res.json(updated)
})

app.listen(5000, ()=>{
  console.log("Server is running on port 5000");
});
