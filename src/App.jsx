import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("dark") === "true";
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("dark", dark);
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const addTodo = () => {
    if (text.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }]);
    setText("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearDone = () => {
    setTodos(todos.filter((t) => !t.done));
  };

  const doneCount = todos.filter((t) => t.done).length;
  const progress = todos.length ? (doneCount / todos.length) * 100 : 0;

  const visible = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>مهامي</h1>
          <p className="sub">
            {doneCount} من {todos.length} منجزة
          </p>
        </div>
        <button className="theme-btn" onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>
      </header>

      <div className="progress">
        <div className="bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="ماذا تريد أن تنجز اليوم؟"
        />
        <button className="add-btn" onClick={addTodo}>
          +
        </button>
      </div>

      <div className="filters">
        {[
          ["all", "الكل"],
          ["active", "المتبقية"],
          ["done", "المنجزة"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? "chip active" : "chip"}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul>
        {visible.length === 0 && (
          <div className="empty">
            <span>📝</span>
            <p>لا توجد مهام هنا</p>
          </div>
        )}

        {visible.map((t) => (
          <li key={t.id} className={t.done ? "done" : ""}>
            <button
              className={t.done ? "check checked" : "check"}
              onClick={() => toggleTodo(t.id)}
            >
              {t.done && "✓"}
            </button>
            <span onClick={() => toggleTodo(t.id)}>{t.text}</span>
            <button className="del-btn" onClick={() => removeTodo(t.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      {doneCount > 0 && (
        <button className="clear-btn" onClick={clearDone}>
          مسح المنجزة ({doneCount})
        </button>
      )}
    </div>
  );
}

export default App;