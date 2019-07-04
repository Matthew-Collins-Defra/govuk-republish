ARG NODE_VERSION=10.15.3
ARG PA11Y_VERSION=2.2.0

FROM node:${NODE_VERSION}-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /home/node

RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
        chromium@edge=72.0.3626.121-r0 \
        nss@edge \
        freetype@edge \
        harfbuzz@edge \
        ttf-freefont@edge

RUN npm install --global pa11y-ci@${PA11y_VERSION}

USER node

COPY --chown=node:node .pa11yci /home/node/

CMD pa11y-ci
