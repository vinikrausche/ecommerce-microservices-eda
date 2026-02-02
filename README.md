# ENGLISH DOCUMENTATION

# ABOUT  
This is a e-commerce microservices + EDA (Event Driven Architeture) project. This project was build using Spring Boot for backend (Java 17) and React.JS + TypeScript + Tailwind + Shadcn  for frontend.


# FUNCTIONALITY

# SERVICES
- user-service (usuarios)
- store-service (produtos/estoque)
- order-service (orquestrador da compra)
- payment-service (pagamentos)
- notification-service (notificacoes)
- store-front-web (frontend)

# EDA (Kafka)
Fluxo basico de eventos:
1) order-service recebe a compra e publica `payment.requested`
2) payment-service processa e publica `payment.approved`
3) order-service publica `order.completed`
4) store-service e notification-service consomem `order.completed`

# HOW TO RUN (DEV)
`docker compose -f docker-compose.dev.yaml up --build`

# HOW TO RUN (PROD)
`docker compose -f docker-compose.prod.yaml up --build`
