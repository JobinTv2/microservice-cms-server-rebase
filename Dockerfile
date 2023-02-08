FROM node:18-alpine As development

WORKDIR "/src/."

COPY --chown=node:node package*.json ./

RUN npm ci
 

COPY --chown=node:node . .

USER node

RUN npm run build

CMD ["node", "dist/main.js"]
