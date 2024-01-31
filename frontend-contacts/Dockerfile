# FROM node:21-alpine as build-stage
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY . /app
# RUN npm ci --loglevel verbose
# RUN npm run build-only


FROM node:21-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build-only
FROM node:21-alpine as production-stage
COPY --from=build-stage /app/dist /dist

# FROM nginx:1.13-alpine as production-stage
# RUN mkdir /app
# COPY --from=build-stage /app/dist /app
# # RUN cp -a /app/. /dist/
# COPY --from=build-stage /app/dist /dist
# # COPY /app/ /dist


# FROM node:21-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY ./ .
# RUN npm run build-only
# COPY ./ /dist