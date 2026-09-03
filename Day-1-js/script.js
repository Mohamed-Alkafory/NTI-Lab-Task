(function () {
  alert("Welcome to my site");
})();

const userName = prompt("Please enter your name:");
console.log(`Welcome ${userName}!`);

const classesMarks = [
  [90, 85, 70, 60, 80], //1
  [95, 90, 92, 88, 95], //2
  [40, 55, 60, 45, 50], //3
];

function calculateAverage(marksArray) {
  const sum = marksArray.reduce((total, mark) => total + mark, 0);
  return sum / marksArray.length;
}

function getGrade(average) {
  switch (true) {
    case average >= 85:
      return "A";
    case average >= 70:
      return "B";
    case average >= 50:
      return "C";
    default:
      return "F";
  }
}

classesMarks.forEach((classMarks, index) => {
  const average = calculateAverage(classMarks);
  const grade = getGrade(average);
  console.log(
    `Class ${index + 1} average = ${average.toFixed(2)} → Grade = ${grade}`,
  );
});
