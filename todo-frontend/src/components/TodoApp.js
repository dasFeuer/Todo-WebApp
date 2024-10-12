import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    // Fetch all todos
    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:8080/todos');
        setTodos(response.data);
    };

    // Create a new todo
    const createTodo = async () => {
        if (!title) return alert("Title is required!");

        const newTodo = { title, description, completed };
        await axios.post('http://localhost:8080/todos', newTodo);
        fetchTodos();
        setTitle('');
        setDescription('');
        setCompleted(false);
    };

    // Update an existing todo
    const updateTodo = async () => {
        if (!editingTodo) return;

        const updatedTodo = { title, description, completed };
        await axios.put(`http://localhost:8080/todos/${editingTodo.id}`, updatedTodo);
        fetchTodos();
        setEditingTodo(null);
        setTitle('');
        setDescription('');
        setCompleted(false);
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:8080/todos/${id}`);
        fetchTodos();
    };

    // Delete all todos
    const deleteAllTodos = async () => {
        if (window.confirm('Are you sure you want to delete all todos?')) {
            await axios.delete('http://localhost:8080/todos');
            fetchTodos();
        }
    };

    // Start editing a todo
    const startEditing = (todo) => {
        setEditingTodo(todo);
        setTitle(todo.title);
        setDescription(todo.description);
        setCompleted(todo.completed);
    };

    // Fetch todos on component mount
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div>
            <h1>Todo List</h1>
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <label>
                    Completed:
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                    />
                </label>
                <button onClick={editingTodo ? updateTodo : createTodo}>
                    {editingTodo ? 'Update Todo' : 'Add Todo'}
                </button>
                {editingTodo && <button onClick={() => setEditingTodo(null)}>Cancel</button>}
            </div>
            <button onClick={deleteAllTodos}>Delete All Todos</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                        <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
                        <button onClick={() => startEditing(todo)}>Edit</button>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;
