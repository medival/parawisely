FROM tiangolo/node-frontend:10 as build-stage

WORKDIR /app

COPY *.json /app/

RUN npm install

COPY . /app/

RUN npm run build

RUN npx browserslist@latest --update-db

FROM nginx:1.15

COPY --from=build-stage /app/build/ /usr/share/nginx/html

COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/nginx.conf