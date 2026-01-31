FROM node:lts-alpine

WORKDIR /app
RUN npm install -g @angular/cli
RUN npm install --global http-server
COPY package*.json ./
RUN npm ci
COPY . ./

RUN ng build --configuration production --define "API_URL='spring-menu-online-service-production.up.railway.app'"

CMD ["npx", "http-server", "-p", "4200", "-c-1", "dist/angular-digital-menu/browser"]
