// The code in this file was reused from CS465 Full Stack Guide Module5
const mongoose = require("mongoose");
const dbURI = process.env.MONGODB_URI;
const readLine = require("readline");

// Build the connection string and set the connection timeout.
// timeout is in milliseconds.
const connect = () => {
  mongoose
    .connect(dbURI)
    .catch((err) => console.log("Mongoose connection error:", err));
};

// Monitor connection events
mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected`);
});
mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

// Windows specific listener
if (process.platform === "win32") {
  const r1 = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  r1.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

// Configure for Graceful Shutdown
const gracefulShutdown = (msg) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
  });
};

// Event Listeners to process graceful shutdowns
// Shutdown invoked by nodemon signal
process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart");
  process.kill(process.pid, "SIGUSR2");
});

// Shutdown invoked by app termination
process.on("SIGINT", () => {
  gracefulShutdown("app termination");
  process.exit(0);
});

// Shutdown invoked by container termination
process.on("SIGTERM", () => {
  gracefulShutdown("app shutdown");
  process.exit(0);
});

// Make initial connection to DB
connect();

// Import Mongoose schema
require("./item");
module.exports = mongoose;
