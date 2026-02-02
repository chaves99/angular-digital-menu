FROM node:lts-alpine AS build
WORKDIR /usr/local/app
RUN npm install -g @angular/cli
COPY ./ /usr/local/app/
RUN npm install
RUN ng build --configuration production --define "API_URL='https://spring-menu-online-service-production.up.railway.app'"


FROM nginx:latest
COPY --from=build /usr/local/app/dist/angular-digital-menu/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
