FROM node:20-slim

# Switch to the root user temporarily to install necessary packages
USER root

# Install the Docker CLI client inside this container so it can run 'docker' commands
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gpg \
    && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && apt-get install -y --no-install-recommends docker-ce-cli && \
    # Clean up the apt cache to keep the image size small
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

USER node

# Copy package files, changing ownership to the 'node' user
COPY --chown=node:node package*.json ./

RUN npm install

# Copy the rest of the application code, changing ownership
COPY --chown=node:node . .

# Expose the port the app runs on
EXPOSE 3000

# The command to run when the container starts
CMD [ "node", "server.js" ]
