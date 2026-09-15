FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 43147
ENV HOSTNAME=0.0.0.0
ENV PORT=43147
CMD ["npm", "run", "start"]
