# Use Node.js LTS version
FROM node:18-alpine
# Set working directory
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy project files
COPY . .
# RUN npm run db:migrate
# Build TypeScript code
RUN npm run build
# Expose port
EXPOSE 3000
# Start the application
CMD ["npm", "start"]
#CMD ["node", "dist/server.js"]