import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/router.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Get directory & file names using ES module compatible methods
const __filename = fileURLToPath(import.meta.url); // Correct way to get __filename
const __dirname = path.dirname(__filename); // Correct way to get __dirname

// EJS VIEW TEMPLATE SETUP

// Setup static folder
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Setting Up EJS as the View Engine
app.set("view engine", "ejs");
// Setting the Views Directory
app.set("views", path.join(__dirname, "views"));

// END EJS VIEW TEMPLATE SETUP

// Body parser middleware
// parse the form data into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the router
app.use("/", router);

// Catch 404 and forward to error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
