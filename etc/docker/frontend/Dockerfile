FROM node:12

ENV APP_ROOT /app
ENV NODE_ENV production
ENV PORT 3000

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD ./frontend ${APP_ROOT}

EXPOSE 3000

RUN npm ci
RUN npm run build