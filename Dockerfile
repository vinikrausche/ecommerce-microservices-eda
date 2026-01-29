FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./servico-ecommerce/mvnw -q -f servico-ecommerce/pom.xml  clean package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/demo/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
