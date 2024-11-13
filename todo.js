const fs = require('fs');

// Load tasks from JSON file or initialize an empty list
const loadTasks = () => {
    try {
        const dataBuffer = fs.readFileSync('tasks.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
};

// Save tasks to JSON file
const saveTasks = (tasks) => {
    const dataJSON = JSON.stringify(tasks);
    fs.writeFileSync('tasks.json', dataJSON);
};

// List all tasks
const listTasks = () => {
    const tasks = loadTasks();
    console.log("Daftar Tugas:");
    tasks.forEach((task, index) => {
        const tags = task.tags ? ` [Tags: ${task.tags.join(', ')}]` : '';
        console.log(`${index + 1}. [${task.completed ? 'X' : ' '}] ${task.content}`);
    });
};

// Add a new task
const addTask = (content) => {
    const tasks = loadTasks();
    tasks.push({ id: tasks.length + 1, content, completed: false, tags: [] });
    saveTasks(tasks);
    console.log(`"${content}" telah ditambahkan`);
};

// Delete a task and re-index the tasks
const deleteTask = (id) => {
    const tasks = loadTasks();
    const currentTask = tasks.find(task => task.id === id);
    const filteredTasks = tasks.filter(task => task.id !== id);

    // Re-index tasks to ensure sequential IDs
    const reindexedTasks = filteredTasks.map((task, index) => ({
        ...task,
        id: index + 1 // Re-assign IDs starting from 1
    }));

    saveTasks(reindexedTasks);

    if (currentTask) {
        console.log(`"${currentTask.content}" telah dihapus dari daftar`);
    } else {
        console.log(`Task dengan ID ${id} tidak ditemukan`);
    }
};

// Mark task as completed
const completeTask = (id) => {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = true;
        saveTasks(tasks);
        console.log(`"${task.content}" telah selesai`);
    } else {
        console.log(`Task ${id} not found`);
    }
};

// Mark task as uncompleted
const uncompleteTask = (id) => {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = false;
        saveTasks(tasks);
        console.log(`"${task.content}" status selesai dibatalkan`);
    } else {
        console.log(`Task ${id} not found`);
    }
};

// List tasks with sorting based on completion status and order (asc/desc)
const listTasksByStatus = (status, order) => {
    const tasks = loadTasks();
    const filteredTasks = tasks.filter(task => task.completed === status);

    // Sort tasks by ID in ascending or descending order
    filteredTasks.sort((a, b) => {
        if (order === 'asc') {
            return a.id - b.id;
        } else if (order === 'desc') {
            return b.id - a.id;
        }
    });

    // Display the filtered and sorted tasks
    console.log(`Daftar Pekerjaan`);
    filteredTasks.forEach((task, index) => {
        const tags = task.tags ? ` [Tags: ${task.tags.join(', ')}]` : '';
        console.log(`${index + 1}. [${task.completed ? 'X' : ' '}] ${task.content}`);
    });
};

// Tag a task with one or more tags
const tagTask = (id, tags) => {
    const tasks = loadTasks();
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.tags = task.tags ? [...new Set([...task.tags, ...tags])] : tags;
        saveTasks(tasks);
        console.log(`Tag '${tags.join(', ')}' telah ditambahkan ke daftar '${task.content}'`);
    } else {
        console.log(`Task dengan ID ${id} tidak ditemukan`);
    }
};

// Filter tasks by tag
const filterTasksByTag = (tag) => {
    const tasks = loadTasks();
    const filteredTasks = tasks.filter(task => task.tags && task.tags.includes(tag));

    console.log(`Daftar Pekerjaan`);
    if (filteredTasks.length > 0) {
        filteredTasks.forEach((task, index) => {
            const tags = task.tags ? ` [Tags: ${task.tags.join(', ')}]` : '';
            console.log(`${index + 1}. [${task.completed ? 'X' : ' '}] ${task.content}`);
        });
    } else {
        console.log(`Tidak ada tugas dengan tag '${tag}'`);
    }
};

// Main function to parse command line arguments
const main = () => {
    const command = process.argv[2];
    console.log(command);
    const args = process.argv.slice(3);

    if (command.startsWith('filter:')) {
        const tag = command.split(':')[1];
        filterTasksByTag(tag);
        return;
    }

    switch (command) {
        case 'list':
            listTasks();
            break;
        case 'add':
            addTask(args.join(' '));
            break;
        case 'delete':
            deleteTask(parseInt(args[0]));
            break;
        case 'complete':
            completeTask(parseInt(args[0]));
            break;
        case 'uncomplete':
            uncompleteTask(parseInt(args[0]));
            break;
        case 'list:outstanding':
            listTasksByStatus(false, args[0]); // false untuk tugas yang belum selesai
            break;
        case 'list:completed':
            listTasksByStatus(true, args[0]); // true untuk tugas yang sudah selesai
            break;
        case 'tag':
            const id = parseInt(args[0]);
            const tags = args.slice(1);
            tagTask(id, tags);
            break;
        default:
            console.log(">>> JS TODO <<<");
            console.log("$ node todo.js <command>");
            console.log("$ node todo.js list");
            console.log("$ node todo.js add <task_content>");
            console.log("$ node todo.js delete <task_id>");
            console.log("$ node todo.js complete <task_id>");
            console.log("$ node todo.js uncomplete <task_id>");
            console.log("$ node todo.js list:outstanding asc|desc");
            console.log("$ node todo.js list:completed asc|desc");
            console.log("$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>");
            console.log("$ node todo.js filter:<tag_name>");
            break;
    }
};

// Run the main function
main();
