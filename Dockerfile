FROM node:18-alpine3.17 as build

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build:deploy

FROM nginx:stable-alpine3.19
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/new/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]