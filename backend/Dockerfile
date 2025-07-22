FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the jar from local machine to inside the container
COPY target/resume-analyzer-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]