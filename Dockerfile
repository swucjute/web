# build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve stage (정적 빌드 결과를 nginx로 서빙)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# SPA 라우팅 fallback (React Router)
RUN printf 'server {\n  listen 80;\n  location / {\n    root /usr/share/nginx/html;\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
