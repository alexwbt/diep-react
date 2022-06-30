###### BUILD ######
FROM node:lts-alpine as build

ARG ENV_FILE

RUN mkdir /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app
COPY yarn.lock /app
RUN yarn install

# COPY tsconfig.json /app
COPY public /app/public
# COPY craco.config.ts /app

COPY src /app/src

COPY .env /app/.env
# RUN rm -f /app/.env && ln -s /app/${ENV_FILE} /app/.env

RUN yarn build


###### RUN SERVER ######
FROM node:lts-alpine

RUN npm i -g http-server

RUN mkdir -p /app/build
COPY --from=build /app/build /app/build
RUN chown -R node:node /app

WORKDIR /app

# ENV HOST=0.0.0.0
# ENV PORT=3000
EXPOSE 3000

CMD ["http-server", "/app/build", "-p", "3000", "-d", "false", "-P", "http://localhost:3000?"]

ARG BUILD_BRANCH
ARG BUILD_COMMIT_HASH
ARG BUILD_TIME

LABEL BUILD_BRANCH=$BUILD_BRANCH
LABEL BUILD_COMMIT_HASH=$BUILD_COMMIT_HASH
LABEL BUILD_TIME=$BUILD_TIME
