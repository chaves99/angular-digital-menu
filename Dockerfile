FROM node:lts-alpine AS build

ARG API_URL

WORKDIR /usr/local/app

RUN npm install -g @angular/cli

COPY ./ /usr/local/app/

ENV API_URL=$API_URL

RUN npm install
RUN ng build --configuration production --define "API_URL=$API_URL"


FROM nginx:latest
COPY --from=build /usr/local/app/dist/angular-digital-menu/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
