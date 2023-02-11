FROM node:13-alpine

ARG NODE_ENV=production

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-distutils python3-pip python3-apt

COPY package*.json ./

RUN apk add --no-cache --virtual build-pack git \
    && npm install \
    && apk del build-pack \
    && apk add --no-cache dumb-init

COPY . .

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "start"]
