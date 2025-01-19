
FROM node:latest
WORKDIR /webview
COPY . .
RUN npm install --force
EXPOSE 5173
CMD ["npm", "run", "start"]