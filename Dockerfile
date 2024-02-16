# Use official Node.js image as base
FROM node:20-alpine

# Set environment variables
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV PORT 3000
# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Bundle app source
COPY . .

# Expose the port dynamically
EXPOSE $PORT

# Command to run the application
CMD ["npm", "start"]