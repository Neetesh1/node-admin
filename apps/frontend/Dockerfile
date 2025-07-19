FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/frontend ./apps/frontend

# Expose port
EXPOSE 4200

# Start the application
CMD ["npm", "run", "start", "--workspace=frontend"]
