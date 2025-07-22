# Dockerfile (for React)
FROM node:18

# Set working directory
WORKDIR /app

# Copy files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the React app
RUN npm run build

# Serve using a lightweight web server
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
