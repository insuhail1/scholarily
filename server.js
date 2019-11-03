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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server connected at ${PORT}`));
