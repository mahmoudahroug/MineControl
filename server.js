const express = require("express");
const { exec, execFile } = require("child_process");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// --- Routes ---

app.post("/api/login", async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).send({ message: "Password is required" });
    }
    console.log("--- Login Attempt ---");
    console.log("Password Received from User:", password);
    console.log("Hash Stored in Environment:", process.env.ADMIN_PASSWORD_HASH);

    try {
        const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
        if (!isValid) {
            return res.status(401).send({ message: "Invalid password" });
        }
        // Generate JWT token
        const token = jwt.sign({ username: "admin" }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
});

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

app.post("/api/action", authenticateToken, async (req, res) => {
    const { action } = req.body;
    
    // optional because no other user
    if (req.user.username !== "admin") {
        return res.status(403).send({ message: "Forbidden" });
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

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token == null) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is invalid or expired' });
        }
        req.user = user;
        next(); // Token is valid, proceed to the route handler
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MineControl server running on port ${PORT}`);
});