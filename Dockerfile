FROM node:18

WORKDIR "/src/."

COPY package*.json ./

RUN npm install

COPY . .

RUN npm build

CMD ["node", "dist/main.js"]
