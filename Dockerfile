# BIM Execution Plan Studio — multi-stage production build
# Stage 1: build frontend (Vite) + backend (tsc) + install prod deps
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime (Node + built assets + prod deps + pandoc + weasyprint + ifcopenshell)
# Debian bookworm-slim (glibc) so ifcopenshell manylinux wheels install.
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends \
    pandoc python3 python3-venv python3-pip fonts-dejavu-core \
    libpango-1.0-0 libpangoft2-1.0-0 libharfbuzz0b libgdk-pixbuf-2.0-0 libffi-dev && \
    rm -rf /var/lib/apt/lists/* && \
    python3 -m venv /app/ifc-venv && \
    /app/ifc-venv/bin/pip install --no-cache-dir weasyprint ifcopenshell
COPY --from=build /app/package.json /app/package-lock.json ./
# Install only production deps in the runtime stage
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server
COPY --from=build /app/server/schema.sql ./dist-server/schema.sql
# IFC/IDS checker: co-locate check.py with the venv; expose venv tools on PATH
ENV PATH="/app/ifc-venv/bin:${PATH}"
RUN cp /app/dist-server/check.py /app/ifc-venv/check.py
EXPOSE 8080
CMD ["node", "dist-server/index.js"]
