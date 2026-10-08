/*
 STUDENT GRADING SYSTEM
 Author: <NOKUKUNDAKWE MARTHA> | Access Number: <B36784>

 Description:
 This program allows a lecturer to enter students and their marks for
 several subjects. It calculates each student's average, assigns a grade
 and remark, and shows a class report with summary statistics.

 How to run:
 1. Open a terminal.
 2. Navigate to the folder containing this file.
 3. Run: node B36784.js   

 How to use:
 - A menu is shown. Type the number of the option you want and press Enter.
 - Option 1: Add a student (enter the name, number of subjects, then marks 0-100).
 - Option 2: View the report of all students entered so far.
 - Option 3: View the class summary (class average, best and weakest student).
 - Option 4: Exit the program.
*/

const readline = require("readline");

// Create the interface used to read input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// If input ends unexpectedly (e.g. Ctrl+D), exit politely
rl.on("close", () => {
  console.log("\nGoodbye!");
  process.exit(0);
});

// Array that stores all students: { name, marks: [], average, grade, remark }
const students = [];

/*  FUNCTIONS */

// FUNCTION 1: Ask the user a question and return their answer as a Promise
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// FUNCTION 2: Keep asking until the user enters a valid number in a range
async function askNumber(question, min, max) {
  while (true) {
    const value = Number(await ask(question));
    // Condition: reject empty/non-numeric input and out-of-range values
    if (Number.isNaN(value) || value < min || value > max) {
      console.log(`  Invalid input. Enter a number from ${min} to ${max}.`);
    } else {
      return value;
    }
  }
}

// FUNCTION 3: Calculate the average of an array of marks
function calculateAverage(marks) {
  let total = 0;
  for (const mark of marks) {
    total += mark; // Loop adds up every mark
  }
  return total / marks.length;
}

// FUNCTION 4: Convert an average mark into a grade and remark
function getGrade(average) {
  if (average >= 80) {
    return { grade: "A", remark: "Excellent" };
  } else if (average >= 70) {
    return { grade: "B", remark: "Very Good" };
  } else if (average >= 60) {
    return { grade: "C", remark: "Good" };
  } else if (average >= 50) {
    return { grade: "D", remark: "Pass" };
  } else {
    return { grade: "F", remark: "Fail" };
  }
}

// FUNCTION 5: Collect a student's details and store them
async function addStudent() {
  console.log("\n--- Add Student ---");
  const name = (await ask("Student name: ")).trim();

  if (name === "") {
    console.log("Name cannot be empty. Student not added.");
    return;
  }

  const count = await askNumber("Number of subjects (1-10): ", 1, 10);
  const marks = [];

  // Loop: collect one mark per subject
  for (let i = 1; i <= count; i++) {
    marks.push(await askNumber(`  Mark for subject ${i} (0-100): `, 0, 100));
  }

  const average = calculateAverage(marks);
  const { grade, remark } = getGrade(average);
  students.push({ name, marks, average, grade, remark });

  console.log(`\n${name} added: average ${average.toFixed(1)}, grade ${grade} (${remark}).`);
}

// FUNCTION 6: Display a table of all students
function displayReport() {
  console.log("\n--- Class Report ---");

  if (students.length === 0) {
    console.log("No students have been added yet.");
    return;
  }

  console.log("No.  Name                 Average  Grade  Remark");
  console.log("----");

  // Loop: print one row per student
  students.forEach((s, index) => {
    console.log(
      `${String(index + 1).padEnd(5)}${s.name.padEnd(21)}${s.average
        .toFixed(1)
        .padEnd(9)}${s.grade.padEnd(7)}${s.remark}`
    );
  });
}

// FUNCTION 7: Show class-wide statistics
function displaySummary() {
  console.log("\n--- Class Summary ---");

  if (students.length === 0) {
    console.log("No students have been added yet.");
    return;
  }

  let best = students[0];
  let weakest = students[0];
  let passed = 0;
  let sum = 0;

  // Loop: find the best, weakest, pass count and total of averages
  for (const s of students) {
    sum += s.average;
    if (s.average > best.average) best = s;
    if (s.average < weakest.average) weakest = s;
    if (s.grade !== "F") passed++;
  }

  console.log(`Students entered : ${students.length}`);
  console.log(`Class average    : ${(sum / students.length).toFixed(1)}`);
  console.log(`Best student     : ${best.name} (${best.average.toFixed(1)})`);
  console.log(`Weakest student  : ${weakest.name} (${weakest.average.toFixed(1)})`);
  console.log(`Passed / Failed  : ${passed} / ${students.length - passed}`);
}

// FUNCTION 8: Main menu loop that keeps the program running
async function main() {
  console.log("========");
  console.log("      STUDENT GRADING SYSTEM");
  console.log("=====================================");

  let running = true;

  // Loop: repeat the menu until the user chooses to exit
  while (running) {
    console.log("\n1. Add student");
    console.log("2. View report");
    console.log("3. View class summary");
    console.log("4. Exit");
    const choice = (await ask("Choose an option (1-4): ")).trim();

    // Conditions: decide what to do based on the user's choice
    if (choice === "1") {
      await addStudent();
    } else if (choice === "2") {
      displayReport();
    } else if (choice === "3") {
      displaySummary();
    } else if (choice === "4") {
      running = false;
      console.log("\nThank you for using the Student Grading System. Goodbye!");
    } else {
      console.log("Invalid option. Please enter 1, 2, 3 or 4.");
    }
  }

  rl.removeAllListeners("close");
  rl.close();
}

// Start the program
main();