# 🎓 Vacation Itinerary Sorter API

This project is a NestJS API that sorts unordered travel tickets into the correct itinerary order. It simulates a fictional backstory involving Kevin, who must follow his family’s planned vacation route across Europe after being accidentally left behind.

---

## ⚛️ Tech Stack

- **Backend:** NestJS
- **Database:** MySQL (via Docker)
- **ORM:** TypeORM
- **API Documentation:** Swagger
- **DevOps:** Docker + Docker Compose
- **Testing:** Jest

---

## ⚙️ Prerequisites

Before running this project, ensure the following are installed:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

> Docker is used to spin up a MySQL container and preload it with the required schema and data. This approach provides portability and eliminates the need to install MySQL manually.

---

## 🧰 How to Run the Project Locally

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/itinerary-vacation.git
cd itinerary-vacation
```

### Step 2: Start Services with Docker Compose

```bash
docker compose up -d
```

This will:

- Start a MySQL database container.
- Automatically create the `tickets` table.
- Seed the database with a set of unordered tickets used in the challenge.

> ✅ You do **not** need to manually run any SQL scripts.

---

## 🧾 Database Seed Data 

## Transport Types table

| id | name   |
| -- | ------ |
| 1  | train  |
| 2  | tram   |
| 3  | flight |
| 4  | bus    |

## Tickets table

| id | transport\_type\_id | departure                         | arrival                           | transport\_number | seat | gate | luggage\_info                                        | additional\_info   | created\_at         |
| -- | ------------------- | --------------------------------- | --------------------------------- | ----------------- | ---- | ---- | ---------------------------------------------------- | ------------------ | ------------------- |
| 1  | 1           | St. Anton am Arlberg Bahnhof      | Innsbruck Hbf                     | RJX 765           | 17C  |      |                                                      | Platform 3         | 2025-06-27 12:52:21 |
| 2  | 2            | Innsbruck Hbf                     | Innsbruck Airport                 | S5                |      |      |                                                      |                    | 2025-06-27 12:52:21 |
| 3  | 3          | Innsbruck Airport                 | Venice Airport                    | AA904             | 18B  | 10   | Self-check-in luggage at counter                     |                    | 2025-06-27 12:52:21 |
| 4  | 1           | Gara Venetia Santa Lucia          | Bologna San Ruffillo              | ICN 35780         | 13F  |      |                                                      | Platform 1         | 2025-06-27 12:52:21 |
| 5  | 4             | Bologna San Ruffillo              | Bologna Guglielmo Marconi Airport |                   |      |      |                                                      | No seat assignment | 2025-06-27 12:52:21 |
| 6  | 3          | Bologna Guglielmo Marconi Airport | Paris CDG Airport                 | AF1229            | 10A  | 22   | Self-check-in luggage at counter                     |                    | 2025-06-27 12:52:21 |
| 7  | 3          | Paris CDG Airport                 | Chicago O'Hare                    | AF136             | 10A  | 32   | Luggage will transfer automatically from last flight |                    | 2025-06-27 12:52:21 |

---

## 🧿 How to Inspect the MySQL Database

If you'd like to access and query the MySQL database manually:

```bash
docker ps                              # List running containers
docker exec -it mysql_itinerary bash  # Access MySQL container shell
mysql -u user -p                      # Connect to MySQL (password: password)
```

Inside the MySQL prompt:

```sql
USE itinerarydb;
SHOW TABLES;
SELECT * FROM tickets;
SELECT * FROM transport_types;
```

---

## 🥪 Running Tests

```bash
npm install
npm run test
```

---

## 📘 API Documentation (Swagger)

Once the app is running, you can access the documentation at:

🔗 [http://localhost:3000/api](http://localhost:3000/api)

---

## 📦 API Endpoints

### `GET /tickets/ordered`

Returns the complete itinerary in human-readable order.

**Example Response:**

```
0. Start.
1. Board train RJX 765, Platform 3 from St. Anton am Arlberg Bahnhof to Innsbruck Hbf. Seat number 17C.
2. Board the tram S5 from Innsbruck Hbf to Innsbruck Airport.
3. From Innsbruck Airport, board the flight AA904 to Venice Airport from gate 10, seat 18B. Self-check-in luggage at counter.
4. Board train ICN 35780, Platform 1 from Venice Airport to Bologna San Ruffillo. Seat number 13F.
5. Board the airport bus from Bologna San Ruffillo to Bologna Guglielmo Marconi Airport. No seat assignment.
6. From Bologna Guglielmo Marconi Airport, board the flight AF1229 to Paris CDG Airport from gate 22, seat 10A. Self-check-in luggage at counter.
7. From Paris CDG Airport, board the flight AF136 to Chicago O'Hare from gate 32, seat 10A. Luggage will transfer automatically from the last flight.
8. Last destination reached.
```

### `GET /tickets`

Returns all raw tickets stored in the database (unordered).

### `GET /tickets/{id}`

Returns a tickets stored in the database.

### `POST /tickets`

Adds a new ticket to the database.

**Example Payload:**

```json
{
  "transportType": {
    "name": "flight"
  },
  "departure": "Chicago O'Hare",
  "arrival": "John F. Kennedy International Airport",
  "transportNumber": "AC1713",
  "seat": "12B",
  "gate": "27",
  "luggageInfo": "Self-check-in luggage at counter",
  "additionalInfo": null
}
```

### `PUT /tickets`

Edit a ticket stored in the database.

**Example Payload:**

```json
{
  "id": 7,
  "departure": "Venice Airport"
}
```

### `DELETE /tickets/{id}`

Delete a ticket stored in the database.

### `DELETE /tickets`

Delete all tickets stored in the database.

---

### `POST /transport-types`

Adds a new transport type to the database.

**Example Payload:**

```json
{
  "name": "ferry"
}
```

### `GET /transport-types`

Returns all raw transport types stored in the database.

### `GET /transport-types/{id}`

Returns a transport type stored in the database.

---

## 🩹 How to Add New Transport Types

You can add new types (e.g., "boat", "taxi", etc.) by:

- Extending the `Ticket` entity with additional fields.
- Updating the formatter helper logic to handle new types.
- Optional: Adjust the Swagger documentation.

---

## 📂 Project Structure

```
src/
│
├── tickets/
│   ├── dto/
│   │   ├── create-ticket.dto.ts      # DTO for creating tickets
│   │   └── update-ticket.dto.ts      # DTO for updating tickets
│   ├── entities/
│   │   └── ticket.entity.ts          # TypeORM Entity definition
│   ├── helpers/
│   │   ├── format-itinerary.ts       # format itinerary result
│   │   └── ticket-sorter.ts          # Sorting algorithm
│   ├── tickets.controller.ts         # Handles HTTP routes
│   ├── tickets.module.ts             # NestJS module
│   └── tickets.service.ts            # Business logic
│
├── transport-types/
│   ├── dto/
│   │   └── create-transport-type.dto.ts
│   ├── entities/
│   │   └── transport-type.entity.ts
│   ├── transport-types.controller.ts
│   ├── transport-types.module.ts
│   └── transport-types.service.ts
│
├── app.module.ts
├── main.ts
```

---

## 📌 Assumptions Made

- Each ticket includes a "departure" and "arrival" location.
- Tickets have valid transport data and form a complete path.
- Luggage handling details are optional and vary per transport.
- Ticket times are irrelevant due to extended validity.

---

## 💬 Notes for Reviewers

- You do **not** need to install MySQL locally. Docker will handle everything.
- If desired, you may insert additional tickets manually via the `POST /tickets` endpoint.
- All seeded data is located inside `docker/mysql-init/02_seed_tickets.sql`.

---

## 👤 Author

Luciano Motta Monsores – [LinkedIn](https://www.linkedin.com/in/luciano-motta-monsores-61695852/)\

