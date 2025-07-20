const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const priceRoute = require("./routes/price");
app.use("/api/price", priceRoute); // Important: mounts both GET and POST

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
