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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});