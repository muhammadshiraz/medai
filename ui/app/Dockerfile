# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
# docker build -f Dockerfile -t tylerm007/medai_frontend --rm .
# docker tag tylerm007/medai_frontend tylerm007/medai_frontend:1.0.0
# docker push tylerm007/medai_frontend:1.0.0  # requires docker login
#
# docker tag tylerm007/medai_frontend tylerm007/medai_frontend:latest
# docker push tylerm007/medai_frontend:latest  
# docker run --name medai_frontend_container -p 3000:3000 tylerm007/medai_frontend:latest
# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS production
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]