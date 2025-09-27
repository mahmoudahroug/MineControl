# 🚀 MineControl – Secure Full-Stack Server Management App

![License](https://img.shields.io/badge/License-MIT-blue.svg)  
![Built With](https://img.shields.io/badge/Built_with-Node.js,_Docker,_Nginx-green)  
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A **secure, full-stack web application** designed to remotely manage a Minecraft server.  
MineControl provides a **user-friendly web interface** for starting and stopping a containerized game server, with a **secure authentication system** and a **production-ready deployment stack**.

What started as a simple need—letting a friend start our server remotely—evolved into a **deep-dive project into the modern web development lifecycle**, from backend API design to secure, containerized deployment.

---

## 🎥 Demo & Architecture

- Clean, responsive UI for authenticated users  
- Real-time server status updates  
- Hardened reverse proxy with **A+ SSL rating** on Qualys SSL Labs  

![Demo](./.github/assets/demo.gif)  
![Architecture](./.github/assets/architecture.png)

---

## ✨ Key Features

- 🔑 **Secure Authentication** – JWT-based login with bcrypt-hashed passwords  
- 🖥️ **Remote Server Control** – Start/stop the Minecraft server with one click  
- 📡 **Live Status Indicator** – Real-time feedback (Offline, Starting, Online)  
- 🐳 **Fully Containerized** – Orchestrated with Docker Compose for one-command deployment  
- 🔒 **Secure by Default** – Nginx reverse proxy with SSL termination & HSTS  

---

## 🛠️ Tech Stack

| Category              | Technologies & Tools                                                                 |
|-----------------------|--------------------------------------------------------------------------------------|
| **Backend**           | Node.js, Express.js, JWT, bcryptjs                                                   |
| **Frontend**          | HTML5, CSS3, Vanilla JavaScript (SPA)                                                |
| **DevOps & Deployment** | Docker, Docker Compose, Nginx (Reverse Proxy)                                       |
| **Security**          | Let’s Encrypt (SSL Certificates), HSTS                                               |
| **Game Server**       | [itzg/minecraft-server](https://hub.docker.com/r/itzg/minecraft-server) Docker Image |

---

## 🏗️ Architecture Overview

MineControl is built with a **multi-tier architecture** for security and separation of concerns:

1. **Proxy Tier (Nginx)**  
   - Public entry point  
   - Handles HTTPS, SSL termination, and reverse proxying  

2. **Application Tier (Node.js)**  
   - Core business logic  
   - Serves frontend, handles authentication, manages Docker socket for server control  

3. **Service Tier (Minecraft Server)**  
   - Containerized game server  
   - Persistent data stored on host via Docker bind mount  

➡️ All services run on a **private Docker network** for secure internal communication.

---

## 🚀 Getting Started

### Prerequisites
- [Git](https://git-scm.com/)  
- [Docker](https://www.docker.com/)  
- [Docker Compose](https://docs.docker.com/compose/)  

### Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/[YOUR_USERNAME]/minecontrol.git
   cd minecontrol
2. **Create the environment file**
   ```sh
   cp .env.example .env
3. **Configure environment variables in .env:**
   - ADMIN_PASSWORD_HASH= # bcrypt hash of your chosen admin password
   - JWT_SECRET=          # a long, random secret string for signing JWTs
   - RCON_PASSWORD=       # secure password for Minecraft server RCON
   - MINECRAFT_DATA_PATH= # absolute host path (e.g., /srv/minecraft)
4. **Run the stack**
   ```sh
   docker-compose up --build -d
## 📦 Usage
1. Open the web interface: https://your-server-ip
2. Log in using your configured admin password
3. Use the Start Server / Stop Server buttons
4. Connect to the server from Minecraft at: your-server-ip:25565
## 📜 License
Distributed under the MIT License. See LICENSE for details.

