/** BizTime express application. */
const express = require("express");
const ExpressError = require("./expressError")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const comapniesRoutes = require("./routes/companies")
const invoicesRoutes = require("./routes/invoices")
app.use("/companies", comapniesRoutes);
app.use("/invoices", invoicesRoutes)

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
