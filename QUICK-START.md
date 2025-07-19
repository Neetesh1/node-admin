# 🚀 Node Admin - Complete Setup & Commands Guide

## 🎯 **Quick Start Commands (With Node 22)**

### **Step 1: Switch to Node 22**
```bash
nvm use 22
node --version  # Should show v22.16.0
```

### **Step 2: Start the Project**
```bash
# Navigate to project root
cd /Users/neetesh.vishwakarma/Documents/NodeJs/node-admin

# Start PostgreSQL Database (if not running)
docker compose -f docker-compose.db.yml up -d

# Start everything together
npm run dev
```

### **Step 3: Check Your Database**
```bash
# Open Prisma Studio (Database GUI)
npx prisma studio
```
**This opens at:** http://localhost:5555

## 🌐 **Access URLs**

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:4200 | 🟡 Starting |
| Backend API | http://localhost:4000 | 🟢 Running |
| Database GUI | http://localhost:5555 | 🟢 Running |
| Health Check | http://localhost:4000/health | 🟢 Working |

## 🗄️ **Check PostgreSQL Tables**

### **Method 1: Prisma Studio (Recommended)**
```bash
npx prisma studio
```
- Opens web interface at http://localhost:5555
- Visual table browser
- Easy data editing

### **Method 2: Command Line**
```bash
# Connect to PostgreSQL container
docker exec -it node-admin-postgres psql -U postgres -d node_admin_db

# Inside PostgreSQL:
\dt                    # List all tables
\d users              # Describe users table
SELECT * FROM users;   # View all users
SELECT * FROM posts;   # View all posts
\q                    # Quit
```

### **Method 3: Quick Queries**
```bash
# View users table
docker exec -it node-admin-postgres psql -U postgres -d node_admin_db -c "SELECT * FROM users;"

# View posts table
docker exec -it node-admin-postgres psql -U postgres -d node_admin_db -c "SELECT * FROM posts;"

# Count records
docker exec -it node-admin-postgres psql -U postgres -d node_admin_db -c "SELECT COUNT(*) FROM users;"
```

### **Database Connection Info:**
- **Host:** localhost
- **Port:** 5433
- **Database:** node_admin_db
- **Username:** postgres
- **Password:** password

## 🛑 **Stop Commands**

### **Stop Development Servers**
```bash
# Stop all (Ctrl+C in the terminal running npm run dev)
# Or kill all Node processes:
pkill -f "node\|nodemon"
```

### **Stop Docker Database**
```bash
docker compose -f docker-compose.db.yml down
```

### **Stop Prisma Studio**
```bash
# Ctrl+C in the terminal running prisma studio
# Or:
pkill -f "prisma studio"
```

## 🔧 **Useful Development Commands**

### **Database Management**
```bash
# Reset database (⚠️ Deletes all data)
npx prisma db push --force-reset

# Generate Prisma client
npx prisma generate

# Create sample data (if you create a seed file)
npx prisma db seed
```

### **Project Management**
```bash
# Build for production
npm run build

# Install new package in backend
cd apps/backend && npm install package-name

# Install new package in frontend
cd apps/frontend && npm install package-name
```

### **Docker Management**
```bash
# View running containers
docker ps

# View PostgreSQL logs
docker logs node-admin-postgres

# Restart database
docker compose -f docker-compose.db.yml restart
```

## 📊 **Current Project Status**

✅ **PostgreSQL Database**: Running on Docker (port 5433)  
✅ **Backend API**: Running with REST endpoints  
✅ **Prisma Studio**: Database GUI available  
✅ **Node.js**: Version 22 activated  
🟡 **Frontend**: Starting up  

## 🚨 **If Frontend Still Has Issues**

If the frontend doesn't start, try:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall frontend dependencies
cd apps/frontend
rm -rf node_modules package-lock.json
npm install

# Start frontend directly
nvm use 22
npm start
```

## 🎯 **Test Your Setup**

```bash
# Test backend API
curl http://localhost:4000/health

# Test database connection
curl http://localhost:4000/api/users

# Check database in browser
# Go to: http://localhost:5555
```

## 📝 **Next Steps**

1. ✅ Database is running
2. ✅ Backend API is working
3. ✅ Database GUI is available
4. 🔄 Frontend is starting up
5. 🎯 Ready for development!

**You can now:**
- View your database tables at http://localhost:5555
- Test your API at http://localhost:4000
- Develop your application with hot reload
