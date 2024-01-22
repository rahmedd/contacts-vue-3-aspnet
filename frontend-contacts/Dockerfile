FROM node:21-alpine as build-stage
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY . /app
# RUN npm ci --loglevel verbose
# RUN npm run build-only
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build-only

FROM nginx:1.13-alpine as production-stage
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build-stage /app/dist /usr/share/nginx/html

RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
# COPY --from=build-stage /app/dist /app