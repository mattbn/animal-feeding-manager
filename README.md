
# animal-feeding-manager

**Progetto per il corso di Programmazione Avanzata A.A. 2023/2024**

## Project goals

The project aims to provide a system capable of managing a workflow relative to withdrawal of foods destined to an animal feeding system. 
An authenticated user can perform various actions, such as:
- Insert new foods (`worker`,`admin` roles).
- Update food quantities (`worker`,`admin`).
- Create orders with a list of foods and their amounts.
- Perform food loads relative to specific orders (`worker`/`admin`)
- Obtain information about foods and orders, like:
	- Order status and load events.
	- Differences between required and loaded food quantities.
	- Total time (in microseconds) used to perform all loads relative to a specific order.

This project has been made using [express](https://expressjs.com/) to manage routes and [sequelize](https://sequelize.org/) to handle database connection.

## Usage

- Ensure [docker](https://www.docker.com/), [docker-compose](https://docs.docker.com/compose/), [node.js](https://nodejs.org/en) and [typescript](https://www.typescriptlang.org/) are installed.
- Ensure a `.env` file with every required key is inside the project folder (`.env.keys` in the project folder contains the list of the required keys).
- Enter the following commands in a terminal inside the project directory:
	- `npx tsc` to compile the project.
	- `docker compose build` or `docker-compose build` to create the container images.
	- `docker compose up` or `docker-compose up` to start the containers.
	- `npm run test` to run tests once the containers are running.

## Design
### UML diagrams

#### Use case diagram
![Use case diagram](./img/usecase.png)

#### Sequence diagrams

##### POST /foods
![Create food](./img/create_food.png)

##### PUT /foods/:id
![Load food](./img/load_food.png)

##### POST /orders
![Create order](./img/create_order.png)

##### POST /orders/:id/load
![Load order](./img/load_order.png)

### Patterns

## Test


