document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    
    // App state
    let tasks = loadTasks() || [];
    
    // Save tasks to localStorage without JSON
    function saveTasks() {
        const tasksString = tasks.map(task => 
            `${encodeURIComponent(task.text)}|${task.completed ? '1' : '0'}`
        ).join(',');
        localStorage.setItem('tasks', tasksString);
    }
    
    // Load tasks from localStorage without JSON
    function loadTasks() {
        const tasksString = localStorage.getItem('tasks');
        if (!tasksString) return [];
        
        return tasksString.split(',').map(taskStr => {
            const [text, completed] = taskStr.split('|');
            return {
                text: decodeURIComponent(text),
                completed: completed === '1'
            };
        });
    }
    
    // Render the entire task list
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.index = index;
            
            // Create elements individually instead of using innerHTML
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            
            const span = document.createElement('span');
            span.textContent = task.text;
            // Apply the completed class only to the span element
            if (task.completed) {
                span.classList.add('completed');
            }
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            
            taskList.appendChild(li);
        });
    }
    
    // Add a new task
    function addTask() {
        const text = taskInput.value.trim();
        
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    }
    
    // Delete a task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
    
    // Toggle task completion
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }
    
    // Event delegation for task interactions
    taskList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        
        const index = parseInt(li.dataset.index, 10);
        
        if (e.target.classList.contains('delete-btn')) {
            deleteTask(index);
        }
    });
    
    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const li = e.target.closest('li');
            if (li) {
                const index = parseInt(li.dataset.index, 10);
                toggleTask(index);
            }
        }
    });
    
    // Add task via button or Enter key
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Initialize
    renderTasks();
});