// methods.js
const fs = require("fs").promises;
const path = require("path");
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

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
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
    console.log("Reading tasks from file:", PATH);
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

    console.log("Loaded tasks:", tasks.length);
    return tasks;
  } catch (err) {
    console.error("Error reading tasks file:", err);
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

    console.log("Task created:", newTask.id);
    return newTask;
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
}

async function deleteTask(taskId) {
  const validatedId = validateTaskId(taskId);

  console.log("Deleting task with id:", validatedId);
  try {
    const tasks = await getTasks();
    const taskExists = tasks.some((task) => task.id === validatedId);

    if (!taskExists) {
      throw new Error("Task not found");
    }

    const newTasks = tasks.filter((task) => task.id !== validatedId);
    const fileContent = taskArrayIntoString(newTasks);
    await atomicWriteFile(fileContent + (fileContent ? "\n" : ""));

    console.log("Task deleted and file updated.");
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
}

// HTTP handlers with proper error handling
async function getHandler(req, res) {
  try {
    const tasks = await getTasks();
    if (tasks.length > 0) {
      sendJSON(res, tasks, 200);
    } else {
      console.log("No tasks present.");
      sendJSON(res, { message: "NO TASK PRESENT" }, 200);
    }
  } catch (err) {
    console.error("GET handler error:", err);
    sendJSON(res, { error: "Internal server error" }, 500);
  }
}

async function postHandler(req, res) {
  try {
    const task = req.body;
    if (!task) {
      sendJSON(res, { error: "Request body is required" }, 400);
      return;
    }

    const response = await createTask(task);
    sendJSON(res, { success: true, data: response }, 201);
  } catch (err) {
    console.error("POST handler error:", err);

    if (err.message.includes("required") || err.message.includes("too long")) {
      sendJSON(res, { error: err.message }, 400);
    } else if (err.message.includes("Maximum number of tasks")) {
      sendJSON(res, { error: err.message }, 409);
    } else {
      sendJSON(res, { error: "Internal server error" }, 500);
    }
  }
}

async function deleteHandler(req, res) {
  try {
    console.log(`http://${req.headers.host}`);
    console.log(`Request Url`, req.url);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");

    console.log("Delete task ID:", id);

    if (!id) {
      sendJSON(res, { error: "Task ID is required" }, 400);
      return;
    }

    await deleteTask(id);
    sendJSON(res, { success: true }, 200);
  } catch (err) {
    console.error("DELETE handler error:", err);

    if (err.message.includes("required") || err.message.includes("not found")) {
      sendJSON(res, { error: err.message }, 400);
    } else {
      sendJSON(res, { error: "Internal server error" }, 500);
    }
  }
}

module.exports = {
  getHandler,
  postHandler,
  deleteHandler,
};
