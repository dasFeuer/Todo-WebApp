import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
        setLoading(false);
    };

    const createTodo = async () => {
        if (!title) return alert("Title is required!");
        setLoading(true);
        try {
            const newTodo = { title, description, completed };
            await axios.post('http://localhost:8080/todos', newTodo);
            fetchTodos();
            setTitle('');
            setDescription('');
            setCompleted(false);
        } catch (error) {
            console.error('Error creating todo:', error);
        }
        setLoading(false);
    };

    const updateTodo = async () => {
        if (!editingTodo) return;
        setLoading(true);
        try {
            const updatedTodo = { title, description, completed };
            await axios.put(`http://localhost:8080/todos/${editingTodo.id}`, updatedTodo);
            fetchTodos();
            setEditingTodo(null);
            setTitle('');
            setDescription('');
            setCompleted(false);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
        setLoading(false);
    };

    const deleteTodo = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8080/todos/${id}`);
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
        setLoading(false);
    };

    const deleteAllTodos = async () => {
        if (window.confirm('Are you sure you want to delete all todos?')) {
            setLoading(true);
            try {
                await axios.delete('http://localhost:8080/todos');
                fetchTodos();
            } catch (error) {
                console.error('Error deleting all todos:', error);
            }
            setLoading(false);
        }
    };

    const startEditing = (todo) => {
        setEditingTodo(todo);
        setTitle(todo.title);
        setDescription(todo.description);
        setCompleted(todo.completed);
    };

    const cancelEditing = () => {
        setEditingTodo(null);
        setTitle('');
        setDescription('');
        setCompleted(false);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="todo-container">
            <h1 className="todo-title">Todo List</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                editingTodo ? updateTodo() : createTodo();
            }} className="add-todo-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="add-todo-input"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="add-todo-textarea"
                />
                <label className="todo-checkbox">
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                    />
                    Completed
                </label>
                <button type="submit" className="add-todo-button" disabled={loading}>
                    {loading ? <div className="loading-spinner"></div> : (editingTodo ? 'Update Todo' : 'Add Todo')}
                </button>
                {editingTodo && (
                    <button onClick={cancelEditing} className="add-todo-button cancel-button">
                        Cancel
                    </button>
                )}
            </form>
            <button onClick={deleteAllTodos} className="add-todo-button delete-all-button" disabled={loading}>
                Delete All Todos
            </button>
            {loading && <div className="loading-spinner"></div>}
            {todos.length === 0 && !loading && <p className="no-todos">No todos yet. Add one above!</p>}
            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        <div className="todo-content">
                            <h3 className="todo-title">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => {
                                        const updatedTodo = { ...todo, completed: !todo.completed };
                                        axios.put(`http://localhost:8080/todos/${todo.id}`, updatedTodo)
                                            .then(fetchTodos)
                                            .catch(error => console.error('Error updating todo:', error));
                                    }}
                                    className="todo-checkbox"
                                />
                                {todo.title}
                            </h3>
                            <p className="todo-description">{todo.description}</p>
                            <p className="todo-meta">
                                <span className="todo-date">Created: {new Date(todo.createAt).toLocaleString()}</span>
                            </p>
                        </div>
                        <div className="todo-actions">
                            <button onClick={() => startEditing(todo)} className="edit-button">
                                <FaEdit />
                            </button>
                            <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;