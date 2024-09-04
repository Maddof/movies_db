const renderIndex = async (req, res, next) => {
  console.log("Rendering index");
  res.render("index");
};

export { renderIndex };
