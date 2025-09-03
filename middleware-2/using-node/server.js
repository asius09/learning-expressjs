//server.js
const http = require("http");
const { getHandler, postHandler, deleteHandler } = require("./methods.js");
const { loggerMiddleware, parseBodyMiddleware } = require("./middlewares.js");
const PORT = 3000;

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

const routes = {
  GET: getHandler,
  POST: postHandler,
  DELETE: deleteHandler,
};

function handler(req, res) {
  try {
    const url = req.url;
    if (url.startsWith("/api/tasks")) {
      const method = req.method;
      if (routes[method]) {
        routes[method](req, res);
      } else {
        console.warn("Method not allowed:", method, url);
        sendJSON(res, { error: "Method Not Allowed" }, 405);
      }
    } else {
      console.warn("Route not found:", req.method, req.url);
      sendJSON(res, { error: "NOT FOUND" }, 404);
    }
  } catch (err) {
    console.error("Internal server error:", err);
    sendJSON(res, { error: "Internal server error" }, 500);
  }
}

const middlewares = [loggerMiddleware, parseBodyMiddleware];

const server = http.createServer(async (req, res) => {
  let idx = 0;

  async function next() {
    try {
      if (idx < middlewares.length) {
        const mw = middlewares[idx++];
        await mw(req, res, next);
      } else {
        handler(req, res);
      }
    } catch (error) {
      console.error("Middleware error:", error);
      sendJSON(res, { error: "Internal server error" }, 500);
    }
  }

  next();
});

server.listen(PORT, () => {
  console.log(`Server Listening on ${PORT}`);
});
