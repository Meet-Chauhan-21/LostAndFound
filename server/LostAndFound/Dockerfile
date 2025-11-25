# Use Maven image to build the application
FROM maven:3.9-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use JRE for running the application (smaller image)
FROM eclipse-temurin:17-jre-jammy

# Set working directory
WORKDIR /app

# Install CA certificates for SSL/TLS (needed for MongoDB Atlas)
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the built JAR from build stage
COPY --from=build /app/target/LostAndFound-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 10000

# Run the application with additional Java options for better MongoDB SSL support
ENTRYPOINT ["java", "-Djavax.net.ssl.trustStoreType=pkcs12", "-jar", "app.jar"]
