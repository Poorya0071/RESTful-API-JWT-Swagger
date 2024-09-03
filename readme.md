### README.md with Complete Setup Instructions


# Todo API Project

This project implements a RESTful API for managing todo items using Node.js, Express, and PostgreSQL. It integrates JWT for secure authentication, making it suitable for demonstrating fundamental API security practices.

## What is a RESTful API?

This project is RESTful as it adheres to the principles of Representational State Transfer (REST). It provides a stateless server by not storing any client state between requests and uses standard HTTP methods like GET, POST, PUT, and DELETE. The API is designed to be consumed by clients over HTTP, providing clear mappings between URL routes and data operations.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. **Node.js and npm**: Ensure you have Node.js and npm installed. If not, download and install them from [Node.js official site](https://nodejs.org/).

### Installation

2. **Clone the repository**
   Clone the project to your local machine.
   ```bash
   git clone https://github.com/yourusername/todo-api.git
   cd todo-api
   ```

3. **Install dependencies**
   Use npm to install the required Node modules.
   ```bash
   npm install
   ```

4. **Set up Express and additional middleware**
   This project uses Express as its web server, along with middleware like `cors` for Cross-Origin Resource Sharing and `jsonwebtoken` for handling JWTs.
   - These dependencies are included in your `package.json` and will be installed in the previous step.

5. **Database setup**
   Ensure that PostgreSQL is installed and running on your machine. Create a database and user for this project and note the credentials for the next step.

6. **Configure environment variables**
   Create a `.env` file in the root directory to store sensitive configuration settings without hard-coding them into your public source code.
   Add the following lines to your `.env` file:
   ```
   DB_USER=your_db_username
   DB_HOST=localhost
   DB_NAME=your_database_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   JWT_SECRET_KEY=your_secret_key
   ```

7. **Start the server**
   Run the server using npm, which will default to `node index.js` as specified in the `package.json`.
   ```bash
   npm start
   ```

## API Endpoints

This API provides a set of endpoints that handle CRUD operations for todo items:

### Authentication

- **POST /login**: Authenticates the user and returns a JWT.

### Todos

- **GET /todos**: Retrieves all todos. Requires JWT authentication.
- **POST /todos**: Adds a new todo item. Requires JWT authentication.
- **GET /todos/{id}**: Retrieves a todo item by ID. Public access.
- **PUT /todos/{id}**: Updates a specific todo item. Requires JWT authentication.
- **DELETE /todos/{id}**: Deletes a specific todo item. Requires JWT authentication.

## Security and Best Practices

- **JWT Authentication**: This API uses JWTs to ensure that some endpoints are protected and require a valid token for access.
- **Environment Variables**: Used to manage configuration settings and sensitive information securely.

