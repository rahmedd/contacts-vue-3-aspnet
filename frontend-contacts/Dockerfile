FROM node:21-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build-only
# FROM node:21-alpine as production-stage
FROM nginx:1.25-alpine as production-stage
ADD https://google.com cache_bust
COPY --from=build-stage /app/dist /dist