# ------------ Build frontend ------------
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# ------------ Build backend ------------
FROM node:18 AS backend
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend
COPY --from=frontend /app/frontend/build ./backend/public

# ------------ Start server ------------
WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["node", "src/server.js"]
