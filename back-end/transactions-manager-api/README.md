# Transactions Manager API

The project is based on [LoopBack](http://loopback.io).

As database we're using PostgreSQL.

## Creating user/datatable for PostgreSQL on Mac

Start by entering the following on the command line:
```bash
psql postgres
```

That’s the psql command line. We can now enter a command to see what users are installed:
```bash
postgres=# \du
```

Add the test user 'transactionsuser' and his password:

```bash
postgres=# CREATE ROLE transactionsuser WITH LOGIN PASSWORD '1234';
```

Add the CREATEDB permission to our new user to allow them to create databases:
```bash
postgres=# ALTER ROLE patrick CREATEDB;
```

Quit, and enter psql again with the 'transactionsuser'
```bash
psql postgres -U transactionsuser
```
Create the test DB 'transactions_manager_app':

```bash
postgres=> CREATE DATABASE transactions_manager_app;
```

Add at least one user who has permission to access the database:

```bash
postgres=> GRANT ALL PRIVILEGES ON DATABASE transactions_manager_app TO transactionsuser;
```

All done, now you've created a user 'transactionsuser' with password '1234' allowed to access a database named 'transactions_manager_app'.

## Useful NPM Scripts

- `npm run create-all-database-tables` will drop and create all tables again, based on the latest model definitions.
