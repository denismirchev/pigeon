# Pigeon

Social network for sharing short opinions and news.
This project is a web application built using **Vue.js** for the frontend, **Express.js** for the backend, and **MySQL** as the database. It is containerized using **Docker Compose** for easy setup and deployment.

## Features
- Frontend: Vue.js (TypeScript/JavaScript)
- Backend: Express.js (Node.js)
- Database: MySQL
- Package management: npm
- Containerized with Docker Compose

## Installation and Running the Project

### Prerequisites
- Docker and Docker Compose installed on your system.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/denismirchev/pigeon.git
   cd https://github.com/denismirchev/pigeon.git
   ``` 
2. Create an .env file based on example.env:
    ```bash
    cp example.env .env
    ```
3. Build and start the containers:
4. ```bash
   docker-compose up --build
   ```
5. Access the application (default ports):
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
6. To stop the containers:
   ```bash
   docker-compose down
   ```

## Additional Notes
- For more details about the frontend app or backend API, check the README.md files in the app or api folders.
- Example auth credentials:
  - Username: `test@test.com`
  - Password: `testtest`
