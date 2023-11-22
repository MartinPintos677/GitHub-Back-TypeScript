require('dotenv').config()

async function runAllSeeders() {
  await require('./userSeeder.ts')()
  //await userSeeder()

  //console.log('[MongoDB] ¡Los datos de prueba fueron insertados!')
  process.exit()
}

runAllSeeders()
