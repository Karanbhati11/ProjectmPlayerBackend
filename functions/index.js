const cors = require("cors");
const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const serverless = require("serverless-http");
const corsOptions = {
  // origin: "https://ytdownloadfrontend.netlify.app",
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  exposedHeaders: "**",
};
app.use(cors(corsOptions));
const router = express.Router();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());
router.get("/", (req, res) => {
  res.send("Hello");
});

router.get("/download", async (req, res) => {
  try {
    const url = req.query.url;
    const videoID = await ytdl.getURLVideoID(url);
    const metaInfo = await ytdl.getInfo(url);
    let audioFormats = ytdl.filterFormats(metaInfo.formats, "audioonly");
    const uuu = {
      url: req.query.url,
      id: videoID,
      info: audioFormats,
      meta: metaInfo,
    };

    return res.send(uuu);
  } catch (err) {
    console.log(err);
  }
});
router.get("/myplay", async (req, res) => {
  try {
    const url = `https://www.youtube.com/watch?v=${req.query.url}`;
    const videoID = await ytdl.getURLVideoID(url);
    const metaInfo = await ytdl.getInfo(url);
    let audioFormats = ytdl.filterFormats(metaInfo.formats, "audioonly");

    const uuu = {
      video_url: url,
      id: videoID,
      info: audioFormats,
      meta: metaInfo,
    };

    return res.send(uuu);
  } catch (err) {
    console.log(err);
  }
});

app.use("/", router);

module.exports.handler = serverless(app);
