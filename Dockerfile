# --- Builder ---
FROM node:20 AS builder
WORKDIR /app

# Copier les dépendances
COPY package*.json ./
RUN npm ci

# Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Code source
COPY . .

# Variables d'environnement pour le build
ARG RESEND_API_KEY
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG NEXT_PUBLIC_BASE_URL

ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
# Variables DB fictives pour le build (les vraies seront définies au runtime)
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"
ENV MONGODB_URI="mongodb://localhost:27017/dummy"

RUN npm run build && npm prune --production

# --- Production ---
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copier seulement ce qui est nécessaire
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Créer le dossier uploads avec les bonnes permissions
RUN mkdir -p /app/public/uploads && chmod 755 /app/public/uploads

EXPOSE 3000
ENV PORT=3000

# Script de démarrage simple avec wait
CMD sh -c '\
  echo "⏳ Waiting for databases..." && \
  node -e "const net=require(\"net\");const waitFor=(host,port)=>new Promise(resolve=>{const check=()=>{const s=net.connect(port,host,()=>{s.end();resolve()}).on(\"error\",()=>setTimeout(check,1000))};check()});Promise.all([waitFor(\"mysql\",3306),waitFor(\"mongo\",27017)]).then(()=>{console.log(\"✅ Databases ready!\");process.exit(0)})" && \
  echo "🔄 Running migrations..." && \
  npx prisma migrate deploy && \
  echo "🚀 Starting app..." && \
  npm start'