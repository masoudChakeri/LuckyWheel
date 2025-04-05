FROM node as development

WORKDIR /usr/src/app

COPY package.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/cart apps/cart
COPY libs libs

RUN cd apps/cart && npm install
RUN npm run build cart

FROM node as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --production
RUN npm install ansis
RUN npm install glob

COPY --from=development /usr/src/app/dist ./dist
COPY proto/* dist/apps/cart

CMD ["node", "dist/apps/cart/src/main"]
