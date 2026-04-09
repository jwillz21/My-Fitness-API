const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/exercises', async (req, res) => {
  const exercises = await prisma.exercise.findMany({
    include: {
      muscles: {
        include: { muscle: true }
      },
      equipment: {
        include: { equipment: true }
      }
    }
  });

  res.json(exercises);
});

app.get('/exercises/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      muscles: { include: { muscle: true } },
      equipment: { include: { equipment: true } }
    }
  });

  res.json(exercise);
});

app.get('/workouts', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    // TODO: Once users are added we will need to validate user existance and ownership of workouts, but for now we will just filter by userId
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: {
        exercises: {
          orderBy: { orderIndex: 'asc' },
          include: {
            exercise: {
              include: {
                muscles: {
                  include: { muscle: true }
                },
                equipment: {
                  include: { equipment: true }
                }
              }
            }
          }
        }
      }
    });

    res.json(workouts);
  } catch (err) {
    console.error('Error fetching workouts:', err);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.post('/workouts', async (req, res) => {
  try {
    const { name, userId, exercises } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ error: 'name and userId are required' });
    }

    const workout = await prisma.workout.create({
      data: {
        name,
        userId,
        exercises: {
          create: exercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            orderIndex: ex.orderIndex ?? index
          }))
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          }
        }
      }
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

app.delete('/workouts/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.workout.delete({
      where: { id }
    });

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});