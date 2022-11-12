const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const cors = require("cors");
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const ytdl = require("ytdl-core");
app.use(bodyParser.json());
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: "https://mplayer1.netlify.app",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// const User = require("./models/UserSchema");
app.use(express.json());
app.use(router);
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
