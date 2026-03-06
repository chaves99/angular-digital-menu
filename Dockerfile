FROM node:22-alpine AS build

ARG API_URL
WORKDIR /app
RUN npm install -g @angular/cli
COPY ./ /app/
ENV API_URL=$API_URL
RUN npm install
RUN ng build --configuration production --define "API_URL='$API_URL'"


FROM node:22-slim
WORKDIR /app
COPY --from=build /app/dist/angular-digital-menu/ ./
CMD ["node", "server/server.mjs"]

# FROM nginx:latest
# COPY --from=build /usr/local/app/dist/angular-digital-menu/browser /usr/share/nginx/html
# COPY /nginx.conf  /etc/nginx/conf.d/default.conf
