FROM node:lts-alpine
ARG APP_NAME
WORKDIR /usr/${APP_NAME}
COPY . .
RUN npm install
CMD ["node", "."]