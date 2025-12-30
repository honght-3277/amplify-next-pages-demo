import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodoContent, setNewTodoContent] = useState("");

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data: any) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    if (newTodoContent.trim()) {
      client.models.Todo.create({
        content: newTodoContent,
      });
      setNewTodoContent("");
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function handleKeyPress(e: any) {
    if (e.key === "Enter") {
      createTodo();
    }
  }

  return (
    <main className="app-container">
      <div className="todo-card">
        <div className="header">
          <div className="logo-container">
            <div className="logo-icon">✨</div>
            <h1>Sun*</h1>
          </div>
          <p className="subtitle">Manage your tasks efficiently</p>
        </div>

        <div className="input-section">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
            onKeyPress={handleKeyPress}
            className="todo-input"
          />
          <button onClick={createTodo} className="add-button">
            <span className="button-icon">+</span>
            Add
          </button>
        </div>

        <div className="todos-container">
          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No tasks available</p>
              <p className="empty-subtitle">Add your first task to get started!</p>
            </div>
          ) : (
            <ul className="todos-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <div className="todo-content">
                    <span className="todo-icon">📌</span>
                    <span className="todo-text">{todo.content}</span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                    title="Delete"
                  >
                    <span className="delete-icon">🗑️</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="footer">
          <div className="stats">
            <span className="stat-badge">{todos.length} tasks</span>
          </div>
          <div className="success-message">
            🥳 App successfully deployed! 
            <a 
              href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/"
              target="_blank"
              rel="noopener noreferrer"
              className="docs-link"
            >
              View documentation →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
