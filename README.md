# Fitness App

After a deep dive on reddit I found a spreadsheet with over 3000 excercises. Now I love a good gym app but these subscriptions costs are getting out of hand so I'm deciding to make one myself. This API will connect to My Fitness App to serve as its data layer. It is built with Node.js, Express.js, and Prisma for database access, and is designed to serve a React Native frontend.

---

### Getting Started

#### Prerequisites

* Node.js ≥ 18
* npm or yarn
* Docker (optional, for containerized setup)

Clone the repository:

```bash
git clone https://github.com/jwillz21/My-Fitness-API.git
cd fitness_api
```

Install dependencies:

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env` file at the root:

```env
DATABASE_URL="mysql://user:password@localhost:3306/fitness_db"
PORT=4000
```

### Running the API

```bash
npm run dev
# or
yarn dev
```

The API will be accessible at `http://localhost:4000`.

### Database Setup

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev --name init
```

### Seed Script

Populate the database with initial data:

```bash
npx prisma db seed
```

Make sure you have a seed file at `prisma/seed.js` or `prisma/seed.ts`.

### API Endpoints

#### Exercises

* `GET /exercises` - List all exercises
* `GET /exercises/:id` - Get exercise details
* TBD

#### Users

* TBD

#### Workouts

* TBD

#### Muscles

* TBD

#### Equipment

* TBD

#### Relationships

* Workouts ↔ Exercises via `WorkoutExercise`
* Exercises ↔ Muscles via `ExerciseMuscle`
* Exercises ↔ Equipment via `ExerciseEquipment`

### Docker Setup

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: fitness_db
      MYSQL_ROOT_PASSWORD: password
    ports:
      - "3306:3306"

  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: "mysql://root:password@db:3306/fitness_db"
    depends_on:
      - db
```

Run the stack:

```bash
docker-compose up --build
```

## Database Schema

### Tables

#### 1. Equipment

* **Purpose:** Stores all types of fitness equipment.
* **Example rows:** Dumbbell, Barbell, Kettlebell, Pull-up Bar.
* **Notes:** Standalone table; exercises are linked via `ExerciseEquipment`.

#### 2. Exercise

* **Purpose:** Stores all exercises users can perform.
* **Example rows:** Push Up, Squat, Deadlift.
* **Notes:** Central table for exercises; many other tables link to it.

#### 3. ExerciseEquipment

* **Purpose:** Join table connecting `Exercise` and `Equipment`.
* **Why:** Many-to-many relationship.
* **Example row:** Push Up → Mat.
* **Notes:** This table connects Exercise → Equipment.

#### 4. ExerciseMuscle

* **Purpose:** Join table connecting `Exercise` and `Muscle`.
* **Why:** Many-to-many relationship.
* **Example row:** Squat → Quadriceps.
* **Notes:** This table connects Exercise → Muscle.

#### 5. Muscle

* **Purpose:** Stores muscles in the body relevant for exercises.
* **Example rows:** Biceps, Quadriceps, Chest.
* **Notes:** Standalone table; linked to exercises through `ExerciseMuscle`.

#### 6. User

* **Purpose:** Stores user accounts.
* **Example fields:** id, name, email, password.
* **Notes:** Independent table; users are linked to workouts.

#### 7. Workout

* **Purpose:** Stores a workout session or plan created by a user.
* **Example rows:** Monday Upper Body, Full Body Circuit.
* **Notes:** Exercises are linked via `WorkoutExercise`.

#### 8. WorkoutExercise

* **Purpose:** Join table connecting `Workout` and `Exercise`.
* **Why:** Many-to-many relationship.
* **Example row:** Monday Upper Body → Push Up.
* **Notes:** This table connects Workout → Exercise.

### Naming Conventions

* Tables with `Exercise` appended are join tables connecting `Exercise` to another entity (`Equipment`, `Muscle`, `Workout`).
* Standalone entities (`Exercise`, `Muscle`, `Equipment`, `Workout`, `User`) are independent tables.

### License

This project is licensed under the MIT License.
