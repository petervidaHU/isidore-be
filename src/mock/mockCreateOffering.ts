const currentDate = new Date();
const futureDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // 1 day into the future

console.log(futureDate);