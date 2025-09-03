const path = require("path");
const PATH = path.join(__dirname, "../user.txt");

exports.parseUserLine = (line) => {
  if (typeof line !== "string") return null;
  const parts = line.split(",");
  if (parts.length < 3) {
    return null;
  }
  const [id, name, email] = parts.map((s) => s.trim());
  return { id, name, email };
};

exports.parseUserObj = (obj) => {
  const { id, name, email } = obj;
  return `${id}, ${name}, ${email}\n`;
};
