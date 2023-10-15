FROM node:16.x

WORKDIR ./

COPY package*.json ./

RUN npm install

COPY . .

# Set environment variables if needed
# ENV NODE_ENV=production

# Use a non-root user (create one with 'USER' and 'RUN useradd' if necessary)

EXPOSE 8000

CMD [ "node", "app.js" ]