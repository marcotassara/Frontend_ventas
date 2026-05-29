FROM node:20-alpine AS compilacion

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS ejecucion

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=compilacion /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
