# Property Matching System

## Objective

The Property Matching System aims to connect property requests with relevant ads based on specific criteria. The system facilitates property seekers in finding suitable properties and enables real estate agents to reach potential clients efficiently.

## Functional Requirements
### 1. Database Schema Design
  - Define schemas for storing property requests, ads, and users.
  - Associate property requests and ads with the users who create them.

### 2. API Endpoints
#### Authentication

- **User Login:**
    - Endpoint for user authentication using phoneNumber and password.

#### Property Requests

- **Create Property Request:**
  - Endpoint for clients to create property requests.

- **Update Property Request:**
  - Endpoint for clients to update property requests.

- **List all Property Requests:**
  - Retrieve a list of all property requests created by the logged-in user with pagination sorted descending by createdAt.
  - Filter by propertyType, minPrice, maxPrice, area, city, district.
  
#### Ads

- **Create Ad:**
  - Endpoint for agents to create ads for properties.

- **List all Property Requests:**
  - Retrieve a list of all ads created by the logged-in user with pagination sorted descending by createdAt.
  - Filter by propertyType, minPrice, maxPrice, area, city, district.

#### Matching System

- **Match Property Requests with Ads:**
  - Endpoint to match property requests with relevant ads based on district, price, and area sorted descending by refreshedAt.
  - Include price tolerance of +/- 10%.
  - Implement pagination in the response.

#### Admin Statistics
- **Get Admin Statistics:**
   - Endpoint for admin users to retrieve statistics about ads and requests for users.
   - Include pagination and total count of users.

### 3. Documentation
   - Detailed Swagger documentation for creating property requests and getting admin statistics.

### 4. Testing
   - Integration testing for the admin stats endpoint using Mocha.

### 5. Authentication and Authorization
   - Implement authentication using JWT tokens.
   - Role-based access control for endpoints (clients, agents, admins).

## Other Features

1. **Dockerization:**
   - Dockerize the application using docker-compose.

2. **Cron job:**
   - Implement a cron job that refresh property requests every 3 days.

## Setup Instructions
### Prerequisites
*  Docker and Docker Compose installed on your machine.

### Steps
1. Clone the repository:
```
git clone https://github.com/EsraaFarhat/Library-Management-System
cd Library-Management-System
```
2. Build and run the containers:
```
docker-compose up --build
```
3. Access the API at http://localhost:3000.

### Notes
   - The above command will also run the seeder so you can log in directly using the credentials mentioned in this file.

## Alternative Setup using Node.js
### Prerequisites
* Node.js installed on your machine.
* MongoDB database running.

### Steps
1. Clone the repository:
```
git clone https://github.com/EsraaFarhat/Library-Management-System
cd Library-Management-System
```
2. Create a .env file:
   *  Copy the contents of .env.example into a new file named .env
   *  Update the variables in the .env file according to your MongoDB database configuration.
3. Install dependencies:
```
npm install
```
4. Run the seeder:
```
npm run seed
```
5. Start the Server:
```
npm start
```
6. Access the API at http://localhost:3000.

## User Credentials
- Admin:
    - phoneNumber: 1234567890
    - Password: Aa12345@
- Client:
    - phoneNumber: 0987654321
    - Password: Aa12345@
- Agent:
    - phoneNumber: 1122334455
    - Password: Aa12345@

## Assumptions and Decisions
   - The pagination limit is set to 1 by default.
   - The pagination limit is set to 10 items per page by default.
   - Any endpoint in the project can be accessed by the admin users.
   - The Seeder directory has different users, property requests, and ads for testing.


## Testing
```
npm test
```

## Documentation

Swagger documentation can be accessed at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/) once you start the server.