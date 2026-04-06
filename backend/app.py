from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Important: Allows frontend at port 3000 to talk to backend at port 5000

# In-memory storage, starting with default tasks
todos = [
    {"id": 1, "task": "Learn Docker"},
    {"id": 2, "task": "Build a Flask App"}
]

@app.route('/api/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/api/todos', methods=['POST'])
def add_todo():
    if not request.json or 'task' not in request.json:
        return jsonify({"error": "Task is required"}), 400
    
    # Simple ID generation based on the length of the existing list
    # For a real app, use UUIDs.
    new_todo = {
        'id': len(todos) + 1,
        'task': request.json['task']
    }
    todos.append(new_todo)
    return jsonify(new_todo), 201

# --- NEW DELETE ENDPOINT ---
@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    # Create a new list *excluding* the ID we want to delete
    todos = [t for t in todos if t['id'] != todo_id]
    return jsonify({"result": "success", "id_removed": todo_id}), 200

if __name__ == '__main__':
    # Binds to all interfaces (0.0.0.0), port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
