# 🚀 Node Admin - Project Commands Guide

## 📦 Project Setup & Start Commands

### 🐳 **Option 1: Docker Setup (Recommended)**

```bash
# Navigate to project root
cd /Users/neetesh.vishwakarma/Documents/NodeJs/node-admin

# Start PostgreSQL Database
docker compose -f docker-compose.db.yml up -d

# Setup Database Schema (First time only)
npx prisma generate
npx prisma db push

# Start Backend API
cd apps/backend
npm run dev

# Start Frontend (in a new terminal)
cd /Users/neetesh.vishwakarma/Documents/NodeJs/node-admin/apps/frontend
npm start
```

### 💻 **Option 2: Local Development**

```bash
# Navigate to project root
cd /Users/neetesh.vishwakarma/Documents/NodeJs/node-admin

# Install all dependencies
npm install

# Start PostgreSQL (if you have it locally)
# OR use Docker: docker compose -f docker-compose.db.yml up -d

# Generate Prisma client
npx prisma generate
npx prisma db push

# Start both backend and frontend together
npm run dev
```

### 🌐 **Option 3: Full Docker Stack**

```bash
# Navigate to project root
cd /Users/neetesh.vishwakarma/Documents/NodeJs/node-admin

# Start everything with Docker
docker compose up -d
```

## 🛑 Stop Commands

### Stop Individual Services
```bash
# Stop backend (Ctrl+C in the terminal where it's running)
# Or if running in background:
pkill -f "nodemon"

# Stop frontend (Ctrl+C in the terminal where it's running)
# Or:
pkill -f "ng serve"
```

### Stop Docker Services
```bash
# Stop database only
docker compose -f docker-compose.db.yml down

# Stop all Docker services
docker compose down

# Stop and remove volumes (⚠️ This will delete data)
docker compose down -v
```

### Stop All Node Processes
```bash
# Kill all Node processes (use with caution)
pkill -f node
```

## 🗄️ PostgreSQL Database Access

### 📊 **Check Tables and Data**

#### Method 1: Prisma Studio (Recommended)
```bash
cd /Users/neetesh.vishwakarma/Documents/NodeJs/node-admin
npx prisma studio
```
This opens a web interface at `http://localhost:5555`

#### Method 2: Command Line Access
```bash
# Connect to PostgreSQL directly
docker exec -it node-admin-postgres psql -U postgres -d node_admin_db

# Once connected, run SQL commands:
# \dt          - List all tables
# \d users     - Describe users table
# SELECT * FROM users;     - View all users
# SELECT * FROM posts;     - View all posts
# \q           - Quit
```

#### Method 3: Database GUI Tools
Use tools like:
- **pgAdmin**: Web-based PostgreSQL admin
- **DBeaver**: Universal database tool
- **TablePlus**: macOS database client

**Connection Details:**
- Host: `localhost`
- Port: `5433`
- Database: `node_admin_db`
- Username: `postgres`
- Password: `password`

#### Method 4: Quick SQL Queries
```bash
# View users table
docker exec -it node-admin-postgres psql -U postgres -d node_admin_db -c "SELECT * FROM users;"

# View posts table
docker exec -it node-admin-postgres psql -U postgres -d node_admin_db -c "SELECT * FROM posts;"

# Count records
docker exec -it node-admin-postgres psql -U postgres -d node_admin_db -c "SELECT COUNT(*) FROM users;"
```

## 🌐 Access URLs

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **API Posts**: http://localhost:4000/api/posts
- **API Users**: http://localhost:4000/api/users
- **Prisma Studio**: http://localhost:5555 (when running)
- **PostgreSQL**: localhost:5433

## 🔧 Useful Development Commands

### Database Management
```bash
# Reset database (⚠️ Deletes all data)
npx prisma db push --force-reset

# Create migration
npx prisma migrate dev --name your_migration_name

# View database schema
npx prisma db pull

# Seed database with sample data (if seed file exists)
npx prisma db seed
```

### Project Management
```bash
# Install new dependency in backend
cd apps/backend && npm install package-name

# Install new dependency in frontend
cd apps/frontend && npm install package-name

# Build for production
npm run build

# Run tests
npm test

# Check code formatting
npm run lint
```

### Docker Management
```bash
# View running containers
docker ps

# View logs
docker logs node-admin-postgres
docker logs node-admin-backend
docker logs node-admin-frontend

# Rebuild containers
docker compose build --no-cache

# Remove all containers and images (clean slate)
docker system prune -a
```

## 🚨 Troubleshooting

### If Backend Won't Start
```bash
# Check if port 4000 is busy
lsof -i :4000

# Restart with clean install
cd apps/backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### If Frontend Won't Start
```bash
# Check if port 4200 is busy
lsof -i :4200

# Clear Angular cache
cd apps/frontend
npx ng cache clean
npm start
```

### If Database Connection Fails
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
docker compose -f docker-compose.db.yml restart

# Check database logs
docker logs node-admin-postgres
```

## 📝 Quick Reference

**Start Everything:**
```bash
cd /Users/neetesh.vishwakarma/Documents/NodeJs/node-admin
docker compose -f docker-compose.db.yml up -d
cd apps/backend && npm run dev &
cd ../frontend && npm start
```

**Stop Everything:**
```bash
pkill -f "nodemon\|ng serve"
docker compose -f docker-compose.db.yml down
```

**Check Database:**
```bash
npx prisma studio
```
