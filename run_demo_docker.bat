@echo off
echo Starting Value OS via Docker...

REM Ensure containers are up
docker-compose up -d db

echo Waiting for Database...
timeout /t 5

echo Installing Dependencies & Setting up DB...
docker-compose run --rm backend sh -c "npm install && npx prisma db push"

echo Running Demo Script...
docker-compose run --rm backend sh -c "npx ts-node scripts/demo_flow.ts"

echo Done!
