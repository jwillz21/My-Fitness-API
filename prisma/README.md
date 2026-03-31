# Fitness App Database Schema

This repository contains the database schema for a fitness application. The schema models users, workouts, exercises, muscles, and equipment, including the many-to-many relationships between exercises and other entities.

---

## Tables

### 1. Equipment
- **Purpose:** Stores all types of fitness equipment.
- **Example rows:** Dumbbell, Barbell, Kettlebell, Pull-up Bar.
- **Notes:** Standalone table; exercises are linked via `ExerciseEquipment`.

---

### 2. Exercise
- **Purpose:** Stores all exercises users can perform.
- **Example rows:** Push Up, Squat, Deadlift.
- **Notes:** Central table for exercises; many other tables link to it.

---

### 3. ExerciseEquipment
- **Purpose:** Join table connecting `Exercise` and `Equipment`.
- **Why:** Many-to-many relationship:
  - One exercise can use multiple pieces of equipment.
  - One piece of equipment can be used by multiple exercises.
- **Example row:** Push Up → Mat.
- **Notes:** `Exercise` appended to clarify this table connects to exercises.

---

### 4. ExerciseMuscle
- **Purpose:** Join table connecting `Exercise` and `Muscle`.
- **Why:** Many-to-many relationship:
  - One exercise can target multiple muscles.
  - One muscle can be targeted by multiple exercises.
- **Example row:** Squat → Quadriceps.
- **Notes:** `Exercise` appended to indicate the Exercise side of the relation.

---

### 5. Muscle
- **Purpose:** Stores muscles in the body relevant for exercises.
- **Example rows:** Biceps, Quadriceps, Chest.
- **Notes:** Standalone table; linked to exercises through `ExerciseMuscle`.

---

### 6. User
- **Purpose:** Stores user accounts.
- **Example fields:** id, name, email, password.
- **Notes:** Independent table; users are linked to workouts.

---

### 7. Workout
- **Purpose:** Stores a workout session or plan created by a user.
- **Example rows:** Monday Upper Body, Full Body Circuit.
- **Notes:** Exercises are linked via `WorkoutExercise`.

---

### 8. WorkoutExercise
- **Purpose:** Join table connecting `Workout` and `Exercise`.
- **Why:** Many-to-many relationship:
  - One workout can include multiple exercises.
  - One exercise can be included in multiple workouts.
- **Example row:** Monday Upper Body → Push Up.
- **Notes:** `Exercise` appended to clarify this table connects Workout → Exercise.

---

## Naming Conventions
- Tables with `Exercise` appended are **join tables** connecting `Exercise` to another entity (`Equipment`, `Muscle`, `Workout`).
- Standalone entities (`Exercise`, `Muscle`, `Equipment`, `Workout`, `User`) are independent tables.
- This structure ensures a clean, readable schema with clear relationships.

---

## Relationships Overview
- **Exercise ↔ Equipment:** Many-to-many via `ExerciseEquipment`
- **Exercise ↔ Muscle:** Many-to-many via `ExerciseMuscle`
- **Workout ↔ Exercise:** Many-to-many via `WorkoutExercise`
- **User ↔ Workout:** One-to-many (one user can have multiple workouts)

---

This schema provides a flexible and extensible foundation for building a fitness app with fully relational data between users, workouts, exercises, muscles, and equipment.