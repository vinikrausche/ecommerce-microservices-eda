SYSTEM CONVENTIONS

Goal:
Standardize monorepo development according to the current implemented flow.

==================================================
1) ARCHITECTURE AND RESPONSIBILITIES
==================================================

Services:
- user-service: user registration/login and JWT issuance.
- store-service: catalog, cart, and inventory update.
- order-service: checkout and order orchestration.
- payment-service: charge creation, Asaas webhook handling, and payment approval publishing.
- notification-service: consumes `order.completed` (notification log).
- store-front-web: React frontend.

Databases:
- One PostgreSQL database per business service (`user`, `store`, `order`, `payment`).

Messaging:
- Kafka with integration topics across services.

==================================================
2) OFFICIAL FLOW (CURRENT)
==================================================

Customer flow:
1. `user-service` creates a user.
2. `user-service` publishes `creation.customer.requested`.
3. `payment-service` consumes it and creates the customer in Asaas.
4. Frontend calls checkout in `order-service` (`POST /api/v1/orders/checkout`) with JWT.
5. `order-service` validates token user, stock/price, and request total.
6. `order-service` calls `payment-service` over HTTP (`POST /api/v1/bills`) using `access_token`.
7. `payment-service` creates the charge in Asaas and stores the bill.
8. Payment approved (immediate status or webhook transition) -> `payment-service` publishes `payment.approved`.
9. `order-service` consumes `payment.approved`, marks order as `COMPLETED`, and publishes `order.completed`.
10. `store-service` consumes `order.completed` and decreases inventory.
11. `notification-service` consumes `order.completed` and logs notification dispatch.

Important:
- `payment.requested` may still exist in config, but it is NOT part of the active checkout flow.

==================================================
3) KAFKA TOPICS AND CONTRACTS
==================================================

Active topics:
- `creation.customer.requested` (producer: user-service, consumer: payment-service)
- `payment.approved` (producer: payment-service, consumer: order-service)
- `order.completed` (producer: order-service, consumers: store-service, notification-service)

Conventions:
- Topic name in lowercase with dot notation (`domain.action`).
- Events must remain simple and stable DTO contracts.
- Any breaking event change requires coordinated producer and consumer updates.

==================================================
4) SECURITY AND HEADERS
==================================================

Service standards:
- user-service:
  - public: `POST /api/v1/users`, `POST /api/v1/login`
  - all other endpoints require `Authorization: Bearer <jwt>`
- order-service:
  - `/api/**` endpoints require `Authorization: Bearer <jwt>`
  - payload `userId` must match token `userId`
- payment-service:
  - internal endpoints require `access_token` header
  - exception: `POST /api/v1/payments/webhook` is public
- store-service:
  - dev: open access
  - prod: `GET /api/v1/products/**` is public; mutating operations require Basic Auth

==================================================
5) API CONVENTIONS (BACKEND)
==================================================

Endpoints:
- Always versioned with `/api/v1`.
- Controllers should return `ResponseEntity` with correct HTTP status.

DTOs:
- Prefer `record` for request/response payloads.
- Use `jakarta.validation` (`@Valid`, `@NotNull`, `@NotBlank`, etc.).
- Keep existing snake_case external contracts (`lastname`, `national_id`, `cart_items`, `user_id`).

Package organization (per service):
- Keep the existing package style already used in that service (`controller/controllers`, `service/services`, `repository/repositories`).
- `dto`
- `entity/entities`
- `config`
- `messaging`
- `client` (external HTTP integrations)
- `com.ecommerce.events` (shared event contracts)

HTTP integrations between services:
- Always use `RestClient` configured in `config/*HttpConfig`.
- Configure default headers and base URL via environment variables.

==================================================
6) FRONTEND CONVENTIONS
==================================================

Structure:
- Pages in `store-front-web/src/pages`.
- Custom components in `store-front-web/src/components`.
- Do not change base components in `store-front-web/src/components/ui` unless truly necessary.

Component style:
- Pages: `export default function NamePage() { ... }`
- Local helper components may use arrow function (`const IconX = () => ...`).
- Do not use class components.

Data layer:
- All HTTP calls must live in `store-front-web/src/services/*`.
- Do not call `axios/fetch` directly inside page components.
- Products/cart: `src/services/api.ts` and `src/services/cart.ts`.
- Users/authentication: `src/services/users.ts`.
- Checkout/orders: `src/services/orders.ts`.
- Authentication and token lifecycle must follow utilities from `src/services/users.ts`.
- Cart state must follow `src/hooks/use-cart.ts`.

Current design system:
- Charcoal black `#121212` (main background)
- Leather brown `#6B3E26` (primary action and highlight)
- Sand beige `#D8CFC4` (supporting visual tone)
- Off-white `#F5F5F5` (text on dark backgrounds)

==================================================
7) ENVIRONMENT AND CONFIGURATION
==================================================

Dev:
- start backend/messaging stack: `./init.bash dev`
- auto watch detection: `./init.bash dev auto`
- forced watch mode: `./init.bash dev watch`

Required variables:
- `user-service/.env.dev`: `JWT_KEY`
- `order-service/.env.dev`: `PAYMENT_BASE_URL`, `PAYMENT_API_KEY`, `JWT_KEY`
- `payment-service/.env.dev`: `ASAAS_API_KEY`, `ASAAS_BASE_URL`, `PAYMENT_API_KEY`

Frontend:
- runs separately from root compose (`npm install` and `npm run dev` in `store-front-web`).

==================================================
8) MAINTENANCE RULES
==================================================

- Do not change HTTP/event contracts without updating consumers.
- Do not introduce a parallel checkout flow without replacing the official one.
- Do not persist secrets in source code.
- Every convention change must update this file and the main README.
