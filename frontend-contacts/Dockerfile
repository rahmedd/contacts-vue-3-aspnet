FROM node:21-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build-only
FROM node:21-alpine as production-stage
COPY --from=build-stage /app/dist /dist