FROM node:21 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build-only
FROM node:21 as production-stage
# FROM nginx:1.25-alpine as production-stage
COPY --from=build-stage /app/dist /app/dist
CMD ["sh", "-c", "cp -rf /app/dist/* /dist"]