const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
// IMPORTANT: Paste your string inside the quotes below and change <db_password> to TaskFlow$2026
mongoose.connect("mongodb+srv://admin:TaskFlow$2026@cluster0.wtt8v10.mongodb.net/?appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((err) => console.error("❌ Connection Error:", err));

// --- DATA MODEL ---
const TaskSchema = new mongoose.Schema({
    text: String,
    isComplete: Boolean
});
const TaskModel = mongoose.model("Task", TaskSchema);

// --- API ROUTES ---

// 1. Get all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await TaskModel.find(); 
    res.json(tasks);
});

// 2. Create a new task
app.post('/tasks', async (req, res) => {
    const newTask = new TaskModel({ text: req.body.text, isComplete: false });
    await newTask.save();
    res.json(newTask);
});

// 3. Delete a task (THIS IS THE NEW PART)
app.delete('/tasks/:id', async (req, res) => {
    const result = await TaskModel.findByIdAndDelete(req.params.id);
    res.json(result);
});
// 4. Toggle Task Completion
app.put('/tasks/:id', async (req, res) => {
    const task = await TaskModel.findById(req.params.id);
    task.isComplete = !task.isComplete; // Flip the value (true -> false, or false -> true)
    await task.save();
    res.json(task);
});


// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});