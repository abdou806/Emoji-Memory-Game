// أضف هذا الكود في ملف JS الخاص بك
const taskChannel = new BroadcastChannel('tasks_channel');

taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const taskDeadline = document.getElementById('task-deadline').value;
    const hasNoEndDate = document.getElementById('task-duration').checked;

    const task = {
        name: taskName,
        deadline: taskDeadline || 'No deadline',
        hasNoEndDate: hasNoEndDate,
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
    };

    // إرسال المهمة عبر القناة
    taskChannel.postMessage({
        type: 'ADD_TASK',
        task: task
    });

    // حفظ المهمة في localStorage
    let tasks = JSON.parse(localStorage.getItem('sharedTasks')) || [];
    tasks.push(task);
    localStorage.setItem('sharedTasks', JSON.stringify(tasks));

    alert('Task added successfully!');
    loadTasks();
});

// معالج الرسائل
taskChannel.onmessage = function(event) {
    if (event.data.type === 'ADD_TASK') {
        let tasks = JSON.parse(localStorage.getItem('sharedTasks')) || [];
        
        const isTaskExists = tasks.some(t => t.id === event.data.task.id);
        if (!isTaskExists) {
            tasks.push(event.data.task);
            localStorage.setItem('sharedTasks', JSON.stringify(tasks));
            loadTasks();
        }
    } else if (event.data.type === 'REMOVE_TASK') {
        let tasks = JSON.parse(localStorage.getItem('sharedTasks')) || [];
        tasks = tasks.filter(t => t.id !== event.data.taskId);
        localStorage.setItem('sharedTasks', JSON.stringify(tasks));
        loadTasks();
    }
};