import React, { useEffect, useState } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = async () => {
    if (input.trim() === "") return;
    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const startEdit = (id, oldText) => {
    setEditingId(id);
    setEditText(oldText);
  };

  const updateTodo = async (id) => {
    const res = await fetch(`http://localhost:5000/todos/${id}`,{
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ text: editText }),
    });
    const updated = await res.json();
    setTodos(todos.map(todo => todo._id === id ? updated : todo));
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Todo App</h2>
        <div className="flex mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTodo}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        <ul className="space-y-3">
          {todos.map((todo, index) => (
            <li key={todo._id || index} className="flex items-center bg-gray-50 p-3 rounded shadow">
              {editingId === todo._id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => updateTodo(todo._id)}
                    className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="ml-2 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1">{todo.text}</span>
                  <button
                    onClick={() => startEdit(todo._id, todo.text)}
                    className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;