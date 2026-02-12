# E-commerce Microservices (Spring Boot + React)

## English

### Overview
This repository contains an e-commerce microservices architecture using:
- Backend: Spring Boot (Java 17)
- Frontend: React + TypeScript + Vite + Tailwind + shadcn/ui
- Messaging: Kafka (Event-Driven Architecture)
- Databases: PostgreSQL per service

### Services and Ports
| Service | Purpose | Host Port |
| --- | --- | --- |
| `user-service` | User CRUD + login (JWT) | `8081` |
| `store-service` | Products + cart + inventory | `8082` |
| `order-service` | Checkout orchestration | `8083` |
| `payment-service` | Billing + Asaas integration + webhook | `8084` |
| `notification-service` | Order-completed consumer (logs notification) | `8085` |
| `store-front-web` | Frontend UI (runs separately) | `5173` |
| `kafka` | Event broker | `9094` (host) |

### Current Flow (Implemented)
1. A user is created in `user-service`.
2. `user-service` publishes `creation.customer.requested`.
3. `payment-service` consumes this event and creates/stores the customer on Asaas.
4. Checkout is called on `order-service` (`POST /api/v1/orders/checkout`) with JWT.
5. `order-service` validates:
   - `userId` in request must match token claim.
   - Product stock and prices via `store-service`.
   - Client amount must match validated total.
6. `order-service` calls `payment-service` (`POST /api/v1/bills`) over HTTP (API key protected).
7. `payment-service` creates the charge on Asaas and stores a bill.
8. When payment is approved (immediate status or webhook transition), `payment-service` publishes `payment.approved`.
9. `order-service` consumes `payment.approved`, marks order as `COMPLETED`, and publishes `order.completed`.
10. `store-service` consumes `order.completed` and decreases product stock.
11. `notification-service` consumes `order.completed` and logs notification dispatch.

Note: `payment.requested` topic is still configured but is not part of the active checkout flow.

### Kafka Topics
| Topic | Producer | Consumers |
| --- | --- | --- |
| `creation.customer.requested` | `user-service` | `payment-service` |
| `payment.approved` | `payment-service` | `order-service` |
| `order.completed` | `order-service` | `store-service`, `notification-service` |

### Required Environment Variables (Dev)
These files are used by `docker-compose.dev.yaml`:

`user-service/.env.dev`
- `JWT_KEY`

`order-service/.env.dev`
- `PAYMENT_BASE_URL`
- `PAYMENT_API_KEY`
- `JWT_KEY`

`payment-service/.env.dev`
- `ASAAS_API_KEY`
- `ASAAS_BASE_URL`
- `PAYMENT_API_KEY`

### Run with Docker
- Dev:
  - `./init.bash dev`
- Dev with auto watch detection:
  - `./init.bash dev auto`
- Dev forcing compose watch:
  - `./init.bash dev watch`
- Dev without watch:
  - `./init.bash dev no-watch`
- Prod:
  - `./init.bash prod`

Important for production: make sure `JWT_KEY`, `PAYMENT_API_KEY`, `ASAAS_API_KEY`, and `ASAAS_BASE_URL` are available to the corresponding containers.

### Frontend
The frontend is not included in root Docker Compose. Run it separately:

```bash
cd store-front-web
npm install
npm run dev
```

### Main HTTP Endpoints
`user-service` (`8081`)
- `POST /api/v1/users`
- `POST /api/v1/login`
- `GET /api/v1/users/{id}` (JWT required)
- `PUT /api/v1/users/{id}` (JWT required)
- `DELETE /api/v1/users/{id}` (JWT required)

`store-service` (`8082`)
- `GET /api/v1/products`
- `GET /api/v1/products/{id}`
- `POST /api/v1/products`
- `PUT /api/v1/products/{id}`
- `GET /api/v1/cart/user/{userId}`
- `POST /api/v1/cart`
- `PUT /api/v1/cart/{id}/items`

`order-service` (`8083`)
- `POST /api/v1/orders/checkout` (JWT required)

`payment-service` (`8084`)
- `POST /api/v1/bills` (header `access_token` required)
- `GET /api/v1/asaas-customers` (header `access_token` required)
- `POST /api/v1/payments/webhook` (public webhook endpoint)

## Português

### Visão Geral
Este repositório contém uma arquitetura de e-commerce com microsserviços usando:
- Backend: Spring Boot (Java 17)
- Frontend: React + TypeScript + Vite + Tailwind + shadcn/ui
- Mensageria: Kafka (Event-Driven Architecture)
- Banco de dados: PostgreSQL por serviço

### Serviços e Portas
| Serviço | Responsabilidade | Porta no host |
| --- | --- | --- |
| `user-service` | CRUD de usuários + login (JWT) | `8081` |
| `store-service` | Produtos + carrinho + estoque | `8082` |
| `order-service` | Orquestração do checkout | `8083` |
| `payment-service` | Cobrança + integração Asaas + webhook | `8084` |
| `notification-service` | Consumidor de pedido concluído (log de notificação) | `8085` |
| `store-front-web` | Frontend (executa separado) | `5173` |
| `kafka` | Broker de eventos | `9094` (host) |

### Fluxo Atual (Implementado)
1. Um usuário é criado no `user-service`.
2. O `user-service` publica `creation.customer.requested`.
3. O `payment-service` consome esse evento e cria/salva o cliente no Asaas.
4. O checkout é chamado no `order-service` (`POST /api/v1/orders/checkout`) com JWT.
5. O `order-service` valida:
   - `userId` da requisição deve ser igual ao claim do token.
   - Preço e estoque dos produtos via `store-service`.
   - Valor enviado pelo cliente deve bater com o total validado.
6. O `order-service` chama o `payment-service` (`POST /api/v1/bills`) via HTTP (protegido por API key).
7. O `payment-service` cria a cobrança no Asaas e salva a bill.
8. Quando o pagamento é aprovado (status imediato ou transição via webhook), o `payment-service` publica `payment.approved`.
9. O `order-service` consome `payment.approved`, marca o pedido como `COMPLETED` e publica `order.completed`.
10. O `store-service` consome `order.completed` e baixa o estoque.
11. O `notification-service` consome `order.completed` e registra o envio de notificação em log.

Observação: o tópico `payment.requested` continua configurado, mas não faz parte do fluxo principal atual de checkout.

### Tópicos Kafka
| Tópico | Produtor | Consumidores |
| --- | --- | --- |
| `creation.customer.requested` | `user-service` | `payment-service` |
| `payment.approved` | `payment-service` | `order-service` |
| `order.completed` | `order-service` | `store-service`, `notification-service` |

### Variáveis Obrigatórias (Dev)
Esses arquivos são usados pelo `docker-compose.dev.yaml`:

`user-service/.env.dev`
- `JWT_KEY`

`order-service/.env.dev`
- `PAYMENT_BASE_URL`
- `PAYMENT_API_KEY`
- `JWT_KEY`

`payment-service/.env.dev`
- `ASAAS_API_KEY`
- `ASAAS_BASE_URL`
- `PAYMENT_API_KEY`

### Como Executar com Docker
- Dev:
  - `./init.bash dev`
- Dev com detecção automática de watch:
  - `./init.bash dev auto`
- Dev forçando watch:
  - `./init.bash dev watch`
- Dev sem watch:
  - `./init.bash dev no-watch`
- Prod:
  - `./init.bash prod`

Importante para produção: garanta que `JWT_KEY`, `PAYMENT_API_KEY`, `ASAAS_API_KEY` e `ASAAS_BASE_URL` estejam disponíveis nos containers correspondentes.

### Frontend
O frontend não está no Docker Compose raiz. Execute separado:

```bash
cd store-front-web
npm install
npm run dev
```

### Principais Endpoints HTTP
`user-service` (`8081`)
- `POST /api/v1/users`
- `POST /api/v1/login`
- `GET /api/v1/users/{id}` (exige JWT)
- `PUT /api/v1/users/{id}` (exige JWT)
- `DELETE /api/v1/users/{id}` (exige JWT)

`store-service` (`8082`)
- `GET /api/v1/products`
- `GET /api/v1/products/{id}`
- `POST /api/v1/products`
- `PUT /api/v1/products/{id}`
- `GET /api/v1/cart/user/{userId}`
- `POST /api/v1/cart`
- `PUT /api/v1/cart/{id}/items`

`order-service` (`8083`)
- `POST /api/v1/orders/checkout` (exige JWT)

`payment-service` (`8084`)
- `POST /api/v1/bills` (exige header `access_token`)
- `GET /api/v1/asaas-customers` (exige header `access_token`)
- `POST /api/v1/payments/webhook` (endpoint público para webhook)
