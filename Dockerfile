FROM node:lts-alpine
ARG APP_NAME
ARG ENTRYPOINT
WORKDIR /usr/${APP_NAME}
COPY . .
RUN npm install
RUN 
CMD ["node", "."]