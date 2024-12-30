# FROM node:20-alpine as dev-deps
# WORKDIR /app
# COPY package.json package.json
# RUN npm install --frozen-lockfile


# FROM node:20-alpine as builder
# WORKDIR /app
# COPY --from=dev-deps /app/node_modules ./node_modules
# COPY . .
# # RUN yarn test
# RUN npm run build


# FROM nginx:1.23.3 as prod
# EXPOSE 80

# COPY --from=builder /app/dist /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d

# CMD [ "nginx","-g", "daemon off;" ]


# Step 1: Use Node.js for building the React app
FROM node:18 as build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code and build it
COPY . ./
RUN npm run build

# Step 2: Use Nginx to serve the React app
FROM nginx:1.23.3 as prod

# Copy the React build to Nginx's default html folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
