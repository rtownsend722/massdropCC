# Massdrop Coding Challenge

This is a job queue that exposes a REST API for retrieving html from a given URL

## Getting Started

Here's how to get this project up and running on your local machine for development.

### Dependencies

- Axios 0.18.0
- Body-Parser 1.18.2
- Express 4.16.2
- Kue 0.11.6
- MySQL 2.15
- MySQL2 1.5.2
- Redis 2.8
- Sequelize 4.34

### Prerequisites

- Global installation of Redis, MySQL, and NPM

### Installing Dependencies and Running Prerequisites

This project's dependencies can be installed by running:

```
npm install
```

This project uses MySQL as it's data persistence layer. Assuming you have MySQL installed on your machine:

```
mysql.server start
mysql -u root
```

This project uses Kue for queuing, which is backed by Redis. Assuming you have Redis installed on your machine:

```
redis-server
```

### Usage

You can use the command line to interact with the REST API.

Example: Add a job to the queue (note: this application accepts url's in the form "www.google.com" and 'google.com')

```
curl -X POST http://localhost:3000/queue \                  
-d url='www.google.com'
```

Example: Retrieve job status or results using transaction id returned from POST request

```
curl -X GET http://localhost:3000/queue \                                                           
-d id=1     
```
