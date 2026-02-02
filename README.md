# ENGLISH DOCUMENTATION

# ABOUT  
This is a e-commerce microservices + EDA (Event Driven Architeture) project. This project was build using Spring Boot for backend (Java 17) and React.JS + TypeScript + Tailwind + Shadcn  for frontend.


# SERVICES
- user-service (users)
- store-service (products/estore)
- order-service (order orchestration)
- payment-service (handle payments)
- notification-service (notifications by email)
- store-front-web (frontend/UI)

# EDA (Kafka)
Basic event flow:
1) order-service receive order and publish `payment.requested`
2) payment-service make the payment process and   publish `payment.approved`
3) order-service publish `order.completed`
4) store-service e notification-service get the event `order.completed`


# HOW TO RUN (DEV)
`./init.bash -dev`

# HOW TO RUN (PROD)
`./init.bash -prod`


#  DOCUMENTAÇÃO EM PORTUGUÊS

# SERVIÇOS
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

# COMO LIGAR OS CONTAINERS (DEV)
`./init.bash -dev`

# COMO LIGAR OS CONTAINERS (PROD)
`./init.bash -prod`
