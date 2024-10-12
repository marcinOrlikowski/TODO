document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('add-task-form');
    const taskList = document.getElementById('task-list');
    const noTasksMessage = document.getElementById('no-tasks-message');

    // Check and toggle the visibility of the no tasks message
    function toggleNoTasksMessage() {
        if (taskList.children.length === 0) {
            noTasksMessage.classList.remove('hidden');
        } else {
            noTasksMessage.classList.add('hidden');
        }
    }

    // Call toggleNoTasksMessage on initial load
    toggleNoTasksMessage();

    // Add task
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskInput = document.getElementById('task-input');
        const taskValue = taskInput.value;

        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: taskValue })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                taskInput.value = ''; // Clear input field

                // Create the task element
                const newTaskElement = document.createElement('li');
                newTaskElement.className = 'task-item';
                newTaskElement.id = `task-${data.task.id}`;
                newTaskElement.innerHTML = `
                    <span class="task-text">${data.task.task}</span>
                    <div class="task-actions">
                        <button type="button" class="complete-btn" data-task-id="${data.task.id}">
                            Complete
                        </button>
                        <button type="button" class="delete-btn" data-task-id="${data.task.id}">
                            Delete
                        </button>
                    </div>
                `;
                taskList.appendChild(newTaskElement);
                toggleNoTasksMessage(); // Check if we need to hide the message
            }
        });
    });

    // Complete and delete functionality using event delegation
    taskList.addEventListener('click', function(event) {
        const taskId = event.target.getAttribute('data-task-id');
        
        if (event.target.classList.contains('complete-btn')) {
            fetch(`/complete/${taskId}`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const taskElement = document.getElementById(`task-${taskId}`);
                    taskElement.classList.toggle('completed');
                    event.target.textContent = taskElement.classList.contains('completed') ? 'Undo' : 'Complete';
                }
            });
        } else if (event.target.classList.contains('delete-btn')) {
            fetch(`/delete/${taskId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const taskElement = document.getElementById(`task-${taskId}`);
                    taskElement.remove(); 
                    toggleNoTasksMessage(); // Check if we need to show the no tasks message
                }
            });
        }
    });
});
