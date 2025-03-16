// const express=require("express")
// const cors = require("cors")

// const app = express();

// //middle ware
// app.use(express.json());
// app.use(cors());

// //memory instead Database
// let tasks = [];

// //homepage
// app.get("/",(req,res)=>{
//     console.log("GET / - Homepage Accessed"); // Debugging Log
//     res.send("<h1>Welcome tot he Task Manager API</h1><p>Use the API endpoints like <code>/tasks</code> to manage tasks.</p>");
// })

// //tasks endpoint to get request
// app.get("/tasks",(req,res)=>{
//     console.log("hello");
//     console.log("All Tasks:", tasks); // Check if task is stored
//     res.json(tasks);
//    })

// //adding new task request handler
// app.post("/tasks",(req,res)=>{
//     const {title}=req.body;
//     if(!title) return res.status(400).json({message: "Title is required"});

//     const newTask = {id: tasks.length + 1,title,completed:false};
//     tasks.push(newTask);
//     console.log("New Task Added:", newTask); // Debugging log
//     console.log("All Tasks:", tasks); // Check if task is stored

//     res.status(201).json(newTask);
// })

// //update the task request handler
// app.put("/tasks/:id",(req,res)=>{
//     console.log("PUT /tasks/:id - Incoming request body:", req.body);
   
//     const {id} = req.params;
//     const {title,completed}=req.body;

//     const task=tasks.find(t=>t.id == parseInt(id));
//     if(!task) return res.status(404).json({message: "Task not found"});

//     if(title !== undefined) task.title = title;
//     if(completed !== undefined) task.completed= completed;
//     console.log("Updated Task:", task);
   
//     res.json(task);
// })

// //delete task request handler
// app.delete("/tasks/:id",(req,res)=>{
//     console.log("DELETE /tasks/:id - Deleting Task ID:", req.params.id);
//     const {id}=req.params;
//     tasks=tasks.filter(t => t.id !== parseInt(id));
//     console.log("Updated Task List:", tasks);
//     res.json({message: "Task deleted"});
// })

// const PORT = 5000;
// app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));


require("dotenv").config();
const express = require("express");

const session = require("express-session");

const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("./config/passport"); // Our passport config
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


// Session middleware (for session-based auth)
app.use(
    session({
      secret: process.env.SESSION_SECRET, // Change this to a secure random string
      resave: false,
      saveUninitialized: false,
    })
  );


// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB
connectDB();

// Set up auth routes
app.use("/auth", authRoutes);
// Set up task routes (protected as needed)
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
