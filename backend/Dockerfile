# Use an official OpenJDK 21 runtime as the base image
FROM openjdk:21-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Create the 'backend' directory inside the container
RUN mkdir backend

# Copy the JAR file from the target folder into the container
COPY target/plantplanet-0.0.1-SNAPSHOT.jar app.jar

# Copy the .env file into the 'backend' directory inside the container
COPY .env backend/.env

# Expose the port that your application will run on
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
