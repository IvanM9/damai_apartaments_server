FROM node:18-alpine

WORKDIR /user/src/app

COPY package.json yarn.lock ./
COPY . .

RUN yarn install
RUN yarn run build:swc

CMD ["yarn", "run", "start:prod"]