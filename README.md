Here’s a clean and concise version of the README for your project setup:

---

# Cada App

## Project Setup

This project is divided into two parts: the **backend** (Kotlin) and the **frontend** (Svelte). The goal is to make it easy for the team to set up and run the project using Docker, without requiring local installations of tools like npm or PostgreSQL.

### Prerequisites

- **Docker**: Ensure Docker is installed and running on your machine. You can download it [here](https://docs.docker.com/get-docker/).

### Running the Project with Docker

To spin up both the backend and the PostgreSQL database using Docker:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/cada-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd cada-app
   ```

3. Run Docker Compose to build and start both services (backend and PostgreSQL):
   ```bash
   docker-compose up --build
   ```

This command will:
- Start a PostgreSQL database on port `5432`.
- Start the Kotlin backend on port `8080`, connected to the PostgreSQL database.

### Frontend Setup (Svelte)

If you need to work with the frontend (Svelte), follow these steps:

1. **Install Node.js** (if not already installed):
   ```bash
   brew update
   brew install node
   ```

2. **Install dependencies**:
   ```bash
   npm install -g pnpm
   ```

3. **Run the frontend development server**:
   ```bash
   pnpm dev
   ```

   This will start the Svelte frontend on `http://localhost:3000`.

### Configuration
- **Database**: PostgreSQL is used for the database and is managed through Docker Compose.

### Environment Variables

The following environment variables are defined in the `docker-compose.yml` for the backend to connect to PostgreSQL:

- `DB_URL`: `jdbc:postgresql://postgres:5432/cadadb`
- `DB_USER`: `cadauser`
- `DB_PASSWORD`: `cadapassword`

### Stopping the Services

To stop the services, run the following command:

```bash
docker-compose down
```

---

You can now copy and paste this README to your project directory. This format provides clear instructions for your team to set up and run the project easily using Docker.