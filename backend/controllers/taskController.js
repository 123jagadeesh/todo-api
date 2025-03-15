const Task = require("../models/Task");

// Fetch all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add new task
const addTask = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ message: "Title is required" });
        const newTask = new Task({ title });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (title !== undefined) task.title = title;
        if (completed !== undefined) task.completed = completed;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
