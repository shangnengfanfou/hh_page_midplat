FROM node:14.16.0-alpine


ADD . /usr/src/app/
WORKDIR /usr/src/app

RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g typescript && \
    npm install pm2 -g && \
    npm install ts-node -g && \
    npm install && \
    npm run build

COPY ./public /usr/src/app/dist/

ENV NODE_ENV production
ENV PORT 8090
CMD [ "pm2-runtime", "dist/src/index.js" ]
