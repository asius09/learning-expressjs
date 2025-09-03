// methods.js
const fs = require("fs").promises;
const crypto = require("crypto");

const PATH = "tasks.txt";
const MAX_TASK_LENGTH = 1000;
const MAX_TASKS = 1000;

// Utility functions
function generateUniqueId() {
  return crypto.randomBytes(8).toString("hex");
}

function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "").substring(0, MAX_TASK_LENGTH);
}

function validateTask(task) {
  if (!task || typeof task !== "object") {
    throw new Error("Task must be an object");
  }

  if (!task.task || typeof task.task !== "string") {
    throw new Error("Task content is required and must be a string");
  }

  const sanitizedTask = sanitizeInput(task.task);
  if (sanitizedTask.length === 0) {
    throw new Error("Task content cannot be empty");
  }

  if (sanitizedTask.length > MAX_TASK_LENGTH) {
    throw new Error(
      `Task content too long. Maximum ${MAX_TASK_LENGTH} characters allowed`
    );
  }

  return { ...task, task: sanitizedTask };
}

function validateTaskId(taskId) {
  if (!taskId || typeof taskId !== "string") {
    throw new Error("Task ID is required and must be a string");
  }

  const sanitizedId = sanitizeInput(taskId);
  if (sanitizedId.length === 0) {
    throw new Error("Task ID cannot be empty");
  }

  return sanitizedId;
}

function taskArrayIntoString(tasks) {
  return tasks.map((task) => `${task.id},${task.task}`).join("\n");
}

// File operations with atomic writes
async function ensureFileExists() {
  try {
    await fs.access(PATH);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(PATH, "");
    } else {
      throw err;
    }
  }
}

async function atomicWriteFile(content) {
  const tempPath = `${PATH}.tmp`;
  try {
    await fs.writeFile(tempPath, content);
    await fs.rename(tempPath, PATH);
  } catch (err) {
    // Clean up temp file if it exists
    try {
      await fs.unlink(tempPath);
    } catch (cleanupErr) {
      // Ignore cleanup errors
    }
    throw err;
  }
}

// Business logic functions
async function getTasks() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(PATH, "utf8");

    if (!data.trim()) {
      return [];
    }

    const tasks = data
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((task) => {
        const [id, content] = task.split(",");
        return { id: id.trim(), task: content.trim() };
      });

    return tasks;
  } catch (err) {
    throw new Error("Failed to read tasks");
  }
}

async function createTask(taskData) {
  const validatedTask = validateTask(taskData);

  try {
    const tasks = await getTasks();

    if (tasks.length >= MAX_TASKS) {
      throw new Error(`Maximum number of tasks (${MAX_TASKS}) reached`);
    }

    const newTask = {
      id: generateUniqueId(),
      task: validatedTask.task,
    };

    tasks.push(newTask);
    const fileContent = taskArrayIntoString(tasks);
    await atomicWriteFile(fileContent + (fileContent ? "\n" : ""));

    return newTask;
  } catch (err) {
    throw err;
  }
}

async function deleteTask(taskId) {
  const validatedId = validateTaskId(taskId);

  try {
    const tasks = await getTasks();
    const taskExists = tasks.some((task) => task.id === validatedId);

    if (!taskExists) {
      throw new Error("Task not found");
    }

    const newTasks = tasks.filter((task) => task.id !== validatedId);
    const fileContent = taskArrayIntoString(newTasks);
    await atomicWriteFile(fileContent + (fileContent ? "\n" : ""));
  } catch (err) {
    throw err;
  }
}

// Express-style HTTP handlers
async function getHandler(req, res) {
  try {
    const tasks = await getTasks();
    if (tasks.length > 0) {
      res.status(200).json(tasks);
    } else {
      res.status(200).json({ message: "NO TASK PRESENT" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function postHandler(req, res) {
  try {
    const task = req.body;
    if (!task) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }

    const response = await createTask(task);
    res.status(201).json({ success: true, data: response });
  } catch (err) {
    if (err.message.includes("required") || err.message.includes("too long")) {
      res.status(400).json({ error: err.message });
    } else if (err.message.includes("Maximum number of tasks")) {
      res.status(409).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

async function deleteHandler(req, res) {
  try {
    // For Express, get id from req.query
    const id = req.query.id;

    if (!id) {
      res.status(400).json({ error: "Task ID is required" });
      return;
    }

    await deleteTask(id);
    res.status(200).json({ success: true });
  } catch (err) {
    if (err.message.includes("required") || err.message.includes("not found")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = {
  getHandler,
  postHandler,
  deleteHandler,
};
