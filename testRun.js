const { mainRun } = require('mainRun');

mainRun("0x12345687")
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
