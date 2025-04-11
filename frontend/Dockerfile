FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Đảm bảo biến môi trường được build vào
ARG REACT_APP_API_URL
ARG REACT_APP_RECAPTCHA_SITE_KEY
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_RECAPTCHA_SITE_KEY=$REACT_APP_RECAPTCHA_SITE_KEY

RUN npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
