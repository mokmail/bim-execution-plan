# BIM Execution Plan Studio — multi-stage production build
# Stage 1: build frontend (Vite) + backend (tsc) + install prod deps
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime (Node + built assets + prod deps only)
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json /app/package-lock.json ./
# Install only production deps in the runtime stage
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server
COPY --from=build /app/server/schema.sql ./dist-server/schema.sql
EXPOSE 8080
CMD ["node", "dist-server/index.js"]
