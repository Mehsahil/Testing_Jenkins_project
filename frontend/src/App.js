import React, { useState, useEffect } from 'react';

// Backend URL constant for easier maintenance
const API_BASE_URL = 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. FETCH TASKS ON LOAD
  useEffect(() => {
    fetch(API_BASE_URL)
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });
  }, []);

  // 2. CREATE (ADD) TASK
  const addTodo = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    })
    .then(res => res.json())
    .then(newTodo => {
      setTodos([...todos, newTodo]); // Optimistic update: Add to local state
      setTask('');
    })
    .catch(err => console.error("Add error:", err));
  };

  // 3. NEW: DELETE TASK
  const deleteTodo = (id) => {
    // Optimistic UI Update: Remove locally first for instant feedback
    const originalTodos = todos;
    setTodos(todos.filter(todo => todo.id !== id));

    // Call API to remove from in-memory storage
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(result => {
      if (result.result !== "success") {
        // If API fails, rollback to original state
        setTodos(originalTodos);
        alert("Failed to delete from server.");
      }
    })
    .catch(err => {
      console.error("Delete error:", err);
      // Rollback on error
      setTodos(originalTodos);
    });
  };

  return (
    // Layout wrapper ensures footer is always at the bottom
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* --- Main Content Section (Pushed up) --- */}
      <main className="flex-grow container mx-auto px-4 py-16 flex items-start justify-center">
        
        {/* Main Card (Glassmorphism look) */}
        <div className="w-full max-w-lg backdrop-blur-md bg-white/70 p-8 rounded-3xl shadow-2xl border border-white/40">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight">Task Master</h1>
            <span className="text-sm font-medium px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full">
              {todos.length} Active
            </span>
          </div>

          {/* Input Form */}
          <form onSubmit={addTodo} className="flex gap-2 mb-10">
            <input 
              className="flex-1 px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all text-lg"
              placeholder="What is your next sprint goal?"
              value={task} 
              onChange={(e) => setTask(e.target.value)} 
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-md"
            >
              Add Task
            </button>
          </form>

          {/* Task List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-6 text-gray-500">Loading your tasks...</div>
            ) : todos.length === 0 ? (
              <div className="text-center py-10 px-6 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-6xl mb-4">🎉</p>
                <p className="text-gray-600 font-medium">All clear! No tasks remaining.</p>
                <p className="text-sm text-gray-500 mt-1">Add one above to get started.</p>
              </div>
            ) : (
              todos.map((t) => (
                // Task Item
                <div 
                  key={t.id} 
                  className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center">
                    {/* Interactive pastel dot indicator */}
                    <div className="h-3 w-3 bg-indigo-300 rounded-full mr-5 group-hover:scale-110 transition-transform"></div>
                    <span className="text-gray-800 font-medium text-lg">{t.task}</span>
                  </div>
                  
                  {/* Delete Button (Visible on Hover) */}
                  <button 
                    onClick={() => deleteTodo(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* --- REVISED FOOTER SECTION --- */}
      <footer className="w-full text-center py-8 bg-white/10 border-t border-white/20">
        <p className="text-gray-700 text-lg font-medium tracking-tight">
          <span className="text-gray-500">Built with In-Memory Flask/React</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Uplinks by <span className="font-semibold text-indigo-500">Dhiraj Meshram</span>
        </p>
      </footer>

    </div>
  );
}

export default App;
