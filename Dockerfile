FROM node:14.4-alpine AS development

WORKDIR /usr/src/app
RUN pwd
RUN ls -l

COPY ./package*.json ./

RUN npm install glob rimraf

RUN npm install #--only=development

EXPOSE 8000
