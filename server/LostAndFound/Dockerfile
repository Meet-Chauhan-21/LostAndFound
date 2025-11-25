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

# Use full JDK for running (includes all SSL/TLS libraries)
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Install CA certificates and update them
RUN apt-get update && \
    apt-get install -y ca-certificates ca-certificates-java && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy the built JAR from build stage
COPY --from=build /app/target/LostAndFound-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 10000

# Run the application with SSL debugging enabled
ENTRYPOINT ["java", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts", \
    "-Djavax.net.ssl.trustStorePassword=changeit", \
    "-jar", "app.jar"]
