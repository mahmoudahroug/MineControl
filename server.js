const express = require("express");
const { exec, execFile } = require("child_process");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// --- Routes ---

app.get("/api/status", (req, res) => {
    // Check if a screen session named "mc-server" exists.
    exec("screen -ls | grep -q 'mc-server'", (error, stdout, stderr) => {
        if (error) {
            // The `grep` command returns an error if it doesn't find a match.
            // This means the server is offline.
            return res.json({ status: 'Offline' });
        }
        res.json({ status: 'Online' });
    });
});

app.post("/api/action", (req, res) => {
    const { password, action } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).send({ message: "Invalid password" });
    }

    if (action !== 'start' && action !== 'stop') {
        return res.status(400).send({ message: "Invalid action" });
    }

    // Use path.join to create a reliable, absolute path to the scripts
    const scriptName = action === "start" ? "start_minecraft.sh" : "stop_minecraft.sh";
    const scriptPath = path.join(__dirname, "scripts", scriptName);

    execFile(scriptPath, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error executing ${scriptName}:`, stderr);
            return res.status(500).send({ message: `Failed to execute action. Server log: ${stderr}` });
        }
        console.log(`Action '${action}' successful:`, stdout);
        return res.send({ message: `Action '${action}' performed successfully.` });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MineControl server running on port ${PORT}`);
});
