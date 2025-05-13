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
3. Configure the JWT_SECTRET env variable with a random string
4. Configure the MONGODB_URI env variable with a MongoDB atlas cluster uri
5. Run the API locally or use the deployed Azure url.
