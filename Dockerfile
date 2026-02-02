# FROM node:lts-alpine
#
# WORKDIR /app
# RUN npm install -g @angular/cli
# RUN npm install --global http-server
# COPY package*.json ./
# RUN npm ci
# COPY . ./
#
# RUN ng build --configuration production --define "API_URL='https://spring-menu-online-service-production.up.railway.app'"
#
# CMD ["npx", "http-server", "-p", "4200", "-c-1", "dist/angular-digital-menu/browser"]

FROM node:lts-alpine AS build
WORKDIR /usr/local/app
RUN npm install -g @angular/cli
COPY ./ /usr/local/app/
RUN npm install
RUN ng build --configuration production --define "API_URL='https://spring-menu-online-service-production.up.railway.app'"


FROM nginx:latest
COPY --from=build /usr/local/app/dist/angular-digital-menu/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
