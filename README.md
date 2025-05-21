# Inventory Management Web API

## Overview

This is a RESTful web API for managing inventory items. The API provides endpoints for CRUD operation and authentication.

## Deployed Site

The API is hosted at:  
[https://inventorymanagementwebapi-hcbrgef9g9e6hnh5.canadacentral-01.azureswindows.net/](https://inventorymanagementwebapi-hcbrgef9g9e6hnh5.canadacentral-01.azurewebsites.net/)

## Swagger Documentation

Explore the API endpoints using Swagger UI:  
[https://inventorymanagementwebapi-hcbrgef9g9e6hnh5.canadacentral-01.azurewebsites.net/api-docs/](https://inventorymanagementwebapi-hcbrgef9g9e6hnh5.canadacentral-01.azurewebsites.net/api-docs/)

## Features

- **CRUD Operations**: Create, Read, Update, and Delete inventory items.
- **Authentication**: Secure endpoints with JWT tokens.

## Technologies

- **Backend**: NodeJS/Express
- **Database**: MongoDB
- **Hosting**: Azure App Service

## Getting Started

1. Clone the repository.
2. Create a .env file
3. Configure the JWT_SECRET env variable with a random string
4. Configure the JWT_REFRESH_SECRET env variable with a random string
5. Configure the MONGODB_URI env variable with a MongoDB atlas cluster uri
6. Run the API locally or use the deployed Azure url.

### If you make any changes be sure to do the following to update the documentation

1. Open the Postman Collection in Postman after you add or modify endpoints
2. Create or modify the endpoints in Postman Collection
3. Export the Postman Collection
4. Go to https://postmantoopenapiconverter.netlify.app/ and paste the postman json
5. Get the open api json and paste it on openApi.json file
6. Run the application with npm start and documentation will be updated.
