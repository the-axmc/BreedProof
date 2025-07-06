// external-oracle/index.js
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const IPFS_JSON_URL = "https://ipfs.io/ipfs/QmZXVw8fDBptS3Fb68BvBsjGvedy5Sate8tizkoq4x6zeU";

app.post("/", async (req, res) => {
  try {
    const animalId = req.body.data.animalId;
    const ipfsData = await axios.get(IPFS_JSON_URL);
    const database = ipfsData.data;

    const info = database[animalId];
    if (!info) {
      return res.status(404).json({
        jobRunID: req.body.id,
        status: "error",
        error: "Animal not found",
      });
    }

    const valueScore = info.recommendations?.valueScore || 0;

    res.status(200).json({
      jobRunID: req.body.id,
      data: { valueScore },
      result: valueScore,
      statusCode: 200,
    });
  } catch (err) {
    res.status(500).json({
      jobRunID: req.body.id,
      status: "errored",
      error: err.message,
    });
  }
});

app.listen(8080, () => console.log("✅ Oracle adapter live on port 8080"));
