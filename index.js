const express = require("express");
const { connectToMongoDB } = require("./connect");
const path = require("path");
const cookieParser = require("cookie-parser");

const { restrictToLoggedInUserOnly, checkAuth } = require("./middlewares/auth");

const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short")
    .then(() => console.log("MongoDB connected !"))
    .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);


app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, 
    {$push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    });

    return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));