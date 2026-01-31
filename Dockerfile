FROM node:lts-alpine

WORKDIR /app
RUN npm install -g @angular/cli
COPY package*.json ./
RUN npm ci
COPY . ./
RUN ng build --define "API_URL='spring-menu-online-service-production.up.railway.app'"
CMD ["ng", "serve", "--host", "0.0.0.0"]
