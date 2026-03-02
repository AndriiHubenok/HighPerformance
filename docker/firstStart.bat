ECHO OFF

docker compose up -d
docker exec iar_orangehrm /init.sh