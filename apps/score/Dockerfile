FROM node as development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/score apps/score
COPY libs libs

RUN cd apps/score && npm install
RUN npm run build score

FROM node as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --production
RUN npm install yallist
RUN npm install keyv
RUN npm install ansis
RUN npm install glob

COPY --from=development /usr/src/app/dist ./dist
COPY proto/* dist/apps/score

CMD ["node", "dist/apps/score/src/main"]
EXPOSE 3000
