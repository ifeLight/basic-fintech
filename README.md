# Basic Fintech Application

This is a minimalistic fintech application built with NestJS and TypeORM, using PostgreSQL as the database.

## Getting Started

### Prerequisites

- Node.js (v16 or later) - Available on [Node.js website](https://nodejs.org/)
- npm (or yarn) - Available on [npm website](https://www.npmjs.com/) or [yarn website](https://yarnpkg.com/)
- PostgreSQL - Available on [PostgreSQL website](https://www.postgresql.org/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ifeLight/basic-fintech.git basic-fintech
cd basic-fintech
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Environment Variables**

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=basic_fintech
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=false
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

Note: Replace `your_username`, `your_password`, and `your_jwt_secret` with your own values.

4. **Run the application**

```bash
npm run start
```

The application should now be running on `http://localhost:3000`.

You can access the API documentation at `http://localhost:3000/docs`.

## Deployment

To deploy this application, you can use the following command:

```bash
npm run build
```

This will compile the TypeScript code into JavaScript and output it to the `dist` directory. You can then run the application using the following command:

```bash
node dist/main
```

## Build Image With Docker

To build a Docker image for this application, you can use the following command:

```bash
docker build -t basic-fintech .
```

This will build a Docker image with the name `basic-fintech`. You can then run the Docker container using the following command:

```bash
docker run -p 3000:3000 basic-fintech
```

This will run the Docker container and expose port 3000 on your host machine.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
