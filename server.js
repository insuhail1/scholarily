const express = require("express");
const connectDB = require("./config/db");

var app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.use("/student", require("./routes/student"));
app.use("/profile", require("./routes/profile"));
app.use("/category", require("./routes/category"));
app.use("/test", require("./routes/test"));
app.use("/image", require("./routes/image"));
app.use("/city", require("./routes/city"));
app.use("/csv", require("./routes/csv"));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server connected at ${PORT}`));
