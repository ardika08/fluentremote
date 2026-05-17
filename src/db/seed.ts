async function seed() {
  console.log(
    "No dummy seed data is created anymore. FluentRemote now issues real user-owned licenses after Mayar payment succeeds.",
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
