# Car Rental Microservice

## Overview
This project is a microservices-based application for managing car rentals. It is developed using **Spring Boot** for the backend services, **Angular** for the frontend, **Eureka Server** for service discovery, **API Gateway** for routing requests, and **Spring Cloud** for additional microservices patterns. The application allows users to search for cars, book rentals, and manage reservations.

## Features
- **Car Management:** Manage and search for available cars.
- **Booking System:** Reserve cars and view booking details.
- **User Management:** Register and manage user accounts.
- **Service Discovery:** **Eureka Server** for locating microservices.
- **API Gateway:** Route requests to appropriate microservices.
- **Scalability:** Designed with **Spring Cloud** for handling distributed systems and microservices patterns.

## Tech Stack
- **Frontend:** Angular
- **Backend:** Spring Boot
- **Service Discovery:** Eureka Server
- **API Gateway:** Spring Cloud Gateway
- **Microservices Framework:** Spring Cloud

## Setup Instructions
### Prerequisites
- Install **Java 11+**,**SpringBoot**
- Install **Angular CLI**: `npm install -g @angular/cli`
- Install **Node.js**: `https://nodejs.org/`
- Install **Maven**: `https://maven.apache.org/`

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/harsht05/car-rental-microservice.git
Navigate to the project directory:
-bash
-Copy code
-cd car-rental-microservice
**Backend Services**
-Eureka Server

-Navigate to the eureka-server directory.
-Build and run the Eureka server:
-bash
-Copy code
-mvn spring-boot:run
-Access Eureka Dashboard at http://localhost:8761.

**API Gateway**

-Navigate to the api-gateway directory.
-Build and run the API Gateway:
-bash
-Copy code
-mvn spring-boot:run
-The API Gateway will route requests to microservices.

**Microservices**

-Navigate to each microservice directory (e.g., car-service, booking-service).
-Build and run each microservice:
-bash
-Copy code
-mvn spring-boot:run

**Frontend**
-Navigate to the frontend directory:
-bash
-Copy code
-cd frontend
-Install dependencies:
-bash
-Copy code
-npm install
-Start the Angular development server:
-bash
-Copy code
-ng serve --open
-Configuration
-Update configuration files such as application.yml in each microservice to include the Eureka server URL and other necessary configurations.
-Configure the API Gateway to route requests to the appropriate microservices.

License
This project is open-source and available under the MIT License.

**Acknowledgments**
-Spring Boot for creating the microservices.
-Angular for the frontend development.
-Eureka Server for service discovery.
-Spring Cloud Gateway for API routing.
