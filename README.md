# Basic Fintech Application

This is a minimalistic fintech application built with NestJS and TypeORM, using PostgreSQL as the database.

## Getting Started

### Technologies Used

- [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- [TypeORM](https://typeorm.io/) - An ORM that can run in NodeJS and can be used with TypeScript and JavaScript.
- [PostgreSQL](https://www.postgresql.org/) - A powerful, open-source object-relational database system.
- [Swagger](https://swagger.io/) - An open-source software framework backed by a large ecosystem of tools that helps developers design, build, document, and consume RESTful web services.
- [Docker](https://www.docker.com/) - A set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.
- JWT - JSON Web Tokens are an open, industry-standard RFC 7519 method for representing claims securely between two parties.

### Prerequisites

- Node.js (v16 or later) - Available on [Node.js website](https://nodejs.org/)
- npm (or yarn) - Available on [npm website](https://www.npmjs.com/) or [yarn website](https://yarnpkg.com/)
- PostgreSQL - Available on [PostgreSQL website](https://www.postgresql.org/)
- Docker (optional) - Available on [Docker website](https://www.docker.com/)

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

## Racing Condition in Fintech Applications

A racing condition occurs when multiple concurrent processes or threads attempt to access and modify the same data resource at the same time, potentially leading to unexpected or incorrect results. In the context of databases, this can have serious consequences for data integrity, especially in financial transactions.

### Real-World Fintech Example: Double Spend

Imagine a scenario where two users, Alice and Bob, both have accounts in a mobile payment application. Alice wants to transfer $100 to Bob. Here's how a racing condition could lead to problems:

1. **Read Balance:** Both Alice and Bob's application read their respective account balances simultaneously.

2. **Insufficient Funds Check:** Both applications independently verify that Alice has sufficient funds ($100) for the transfer.

3. **Race Condition:** Due to the asynchronous nature of communication, there's a chance both applications might finish step 2 (verifying funds) at nearly the same time.

4. **Potential Double Debit** Now, both applications attempt to deduct $100 from Alice's account and credit Bob's account.

Without proper handling of concurrent access, this can lead to a situation where:

- Alice's account is debited twice (once for each application).
- Bob receives $100 only once (credited by only one application).

This results in a "double spend" scenario, where Alice loses $100 and Bob gains only $100, causing a financial discrepancy.

### Mitigating Racing Conditions with Transactions

Thankfully, databases provide mechanisms to handle concurrent access and prevent racing conditions. One common solution is using database transactions.

A transaction groups multiple database operations into a single unit. Either all operations within the transaction succeed **(commit)**, or none of them do **(rollback)**. This ensures that the data remains consistent and reflects a single, logical state.

In the `src/wallet//wallet.controller.spec.ts`, we see the use of transactions in the `fundWalletByAccountNumber` and `transferToAccountNumber` methods. These methods utilize the transaction function with the isolation level set to `SERIALIZABLE`. This ensures that other transactions are blocked while the current transaction is executing, preventing race conditions.

Here are some key points from the code:

- **Pessimistic Locking:** Both methods use `lock: { mode: 'pessimistic_write' }` when fetching user wallets. This prevents other transactions from modifying the wallets concurrently.

- **Atomic Updates:** The balance updates in `transferToAccountNumber` are performed within the transaction, guaranteeing that either both wallets are updated _(successful transfer)_ or neither is _(insufficient funds)_.

- **Error Handling:** Both methods use `Promise.allSettled` to check the outcome of all operations within the transaction. If any operation fails, the entire transaction is rolled back.

By implementing transactions and proper locking mechanisms, we can significantly reduce the risk of racing conditions and ensure the integrity of financial data in fintech applications.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
