const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

const saveTasks = () => {
    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
};

const showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    document.getElementById(pageId).style.display = 'block';

    document.querySelectorAll('.nav-bar a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-bar a[href="#${pageId}"]`).classList.add('active');
};

const renderTasks = () => {
    const pendingList = document.getElementById('pending-tasks-list');
    const completedList = document.getElementById('completed-tasks-list');
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    pendingTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${task.name} - ${task.time}</span>`;
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deletePendingTask(index);

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.onclick = () => markAsCompleted(index);

        buttonGroup.appendChild(deleteButton);
        buttonGroup.appendChild(completeButton);
        li.appendChild(buttonGroup);
        pendingList.appendChild(li);
    });

    completedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${task.name} - ${task.time}</span>`;
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteCompletedTask(index);

        buttonGroup.appendChild(deleteButton);
        li.appendChild(buttonGroup);
        completedList.appendChild(li);
    });
};

const addTask = () => {
    const name = document.getElementById('task-name').value;
    const time = document.getElementById('task-time').value;

    if (!name || !time) {
        alert('Please fill all fields');
        return;
    }

    const task = { name, time };
    pendingTasks.push(task);
    saveTasks();
    renderTasks();
    document.getElementById('task-name').value = '';
    document.getElementById('task-time').value = '';
};

const deletePendingTask = (index) => {
    pendingTasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

const deleteCompletedTask = (index) => {
    completedTasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

const markAsCompleted = (index) => {
    const task = pendingTasks.splice(index, 1)[0];
    completedTasks.push(task);
    saveTasks();
    renderTasks();
};

const requestNotificationPermission = async () => {
    if (Notification.permission === 'default' || Notification.permission === 'denied') {
        await Notification.requestPermission();
    }
};

const checkTaskNotifications = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    pendingTasks.forEach((task) => {
        if (task.time === currentTime) {
            if (Notification.permission === 'granted') {
                const notification = new Notification('Task Reminder', {
                    body: `It's time for ${task.name}`,
                    icon: 'https://via.placeholder.com/64'
                });

                notification.onclick = () => {
                    alert(`Reminder for task: ${task.name}`);
                };
            }
        }
    });
};

window.onload = () => {
    requestNotificationPermission();
    showPage('add-task');
    renderTasks();
    setInterval(checkTaskNotifications, 60000);
};
