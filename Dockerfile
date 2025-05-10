FROM node:16-alpine

RUN apk update && apk upgrade --no-cache && apk add --quiet git libc6-compat

# Fix binaries problem of the uws module
# RUN cp /lib64/ld-linux-x86-64.so.2 /lib

WORKDIR /stream-server
COPY . .
RUN npm install --quiet

CMD ["node", "index.js"]
