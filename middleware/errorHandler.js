//import { links } from "../controllers/messageController.js";

// Catch 404 and forward to error handler
const errorHandler = (req, res, next) => {
  res.status(404).render("404", { title: "404" });
};

export default errorHandler;
