const express = require("express");
const { getTasks, addTask, updateTask, deleteTask } = require("../controllers/taskController");
const ensureAuthenticated = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", ensureAuthenticated, getTasks);
router.post("/", ensureAuthenticated, addTask);
router.put("/:id", ensureAuthenticated, updateTask);
router.delete("/:id", ensureAuthenticated, deleteTask);
module.exports = router;
