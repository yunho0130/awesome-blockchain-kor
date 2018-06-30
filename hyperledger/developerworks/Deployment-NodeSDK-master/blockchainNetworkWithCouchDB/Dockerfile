FROM docker.io/library/node:6.11.3

ENV NODE_ENV production
ENV PORT 3000
ENV DOCKER_SOCKET_PATH /host/var/run/docker.sock
ENV DOCKER_CCENV_IMAGE=hyperledger/fabric-ccenv:x86_64-1.1.0

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
