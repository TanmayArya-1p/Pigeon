
FROM node:latest
WORKDIR /webview
COPY . .
RUN npm install --force
EXPOSE 8010
CMD ["npm", "run", "start" , "--port" , "8010"]