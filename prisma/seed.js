const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function splitValues(value) {
  if (!value) return [];
  return value.split(',').map(v => v.trim()).filter(Boolean);
}

async function getOrCreateMuscle(name) {
  return prisma.muscle.upsert({
    where: { name },
    update: {},
    create: { name }
  });
}

async function getOrCreateEquipment(name) {
  return prisma.equipment.upsert({
    where: { name },
    update: {},
    create: { name }
  });
}

async function main() {
  const results = [];

  fs.createReadStream('./data/exercises.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        try {
          const exercise = await prisma.exercise.create({
            data: {
              name: row['Exercise'],
              difficulty: row['Difficulty Level'],
              posture: row['Posture'],
              grip: row['Grip'],
              loadPosition: row['Load Position (Ending)'],
              movementPattern1: row['Movement Pattern #1'],
              movementPattern2: row['Movement Pattern #2'],
              planeOfMotion: row['Plane Of Motion #1'],
              bodyRegion: row['Body Region'],
              forceType: row['Force Type'],
              mechanics: row['Mechanics'],
              classification: row['Primary Exercise Classification']
            }
          });

          // Muscles
          const primaryMuscles = splitValues(row['Prime Mover Muscle']);
          const secondaryMuscles = splitValues(row['Secondary Muscle']);

          for (const m of primaryMuscles) {
            const muscle = await getOrCreateMuscle(m);

            await prisma.exerciseMuscle.create({
              data: {
                exerciseId: exercise.id,
                muscleId: muscle.id,
                type: 'primary'
              }
            });
          }

          for (const m of secondaryMuscles) {
            const muscle = await getOrCreateMuscle(m);

            await prisma.exerciseMuscle.create({
              data: {
                exerciseId: exercise.id,
                muscleId: muscle.id,
                type: 'secondary'
              }
            });
          }

          // Equipment
          const equipmentList = [
            ...splitValues(row['Primary Equipment ']),
            ...splitValues(row['Secondary Equipment'])
          ];

          for (const eq of equipmentList) {
            const equipment = await getOrCreateEquipment(eq);

            await prisma.exerciseEquipment.create({
              data: {
                exerciseId: exercise.id,
                equipmentId: equipment.id
              }
            });
          }

        } catch (err) {
          console.error('Error processing row:', row['Exercise'], err);
        }
      }

      console.log('Seeding complete 🌱');
      process.exit(0);
    });
}

main();