FROM node:12

ENV APP_ROOT /app
ENV NODE_ENV production
ENV PORT 5000

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD ./backend ${APP_ROOT}

EXPOSE 5000

RUN npm ci
CMD [ "npm", "run", "start" ]