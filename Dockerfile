# Step 1: Builder
FROM node:18 AS build

WORKDIR /app

# Copy only package files first to cache dependencies
COPY package*.json ./
RUN npm install

# THEN copy the rest of the files
COPY . .
RUN npm run build
