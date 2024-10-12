from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)
tasks_file = 'tasks.json'

# Load tasks from the JSON file
def load_tasks():
    if os.path.exists(tasks_file):
        with open(tasks_file, 'r') as f:
            return json.load(f)
    return []

# Save tasks to the JSON file
def save_tasks(tasks):
    with open(tasks_file, 'w') as f:
        json.dump(tasks, f)

@app.route('/')
def index():
    tasks = load_tasks()
    return render_template('index.html', tasks=tasks)

@app.route('/add', methods=['POST'])
def add_task():
    task_content = request.json.get('task')
    tasks = load_tasks()
    new_task = {'id': len(tasks) + 1, 'task': task_content, 'completed': False}
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify({'success': True, 'task': new_task})

@app.route('/complete/<int:task_id>', methods=['POST'])
def complete_task(task_id):
    tasks = load_tasks()
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            break
    save_tasks(tasks)
    return jsonify({'success': True})

@app.route('/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [task for task in tasks if task['id'] != task_id]
    save_tasks(tasks)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
