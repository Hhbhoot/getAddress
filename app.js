import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/v1/get-address", async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log(apiKey);
  console.log(lat, lng);

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      res.json({ address: data.results[0].formatted_address });
    } else {
      res.status(400).json({ error: data.status });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
