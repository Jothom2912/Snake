"use strict";

// Model
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    return this.items.shift();
  }

  peekLast() {
    return this.items[this.items.length - 1];
  }

  contains(element) {
    return this.items.some(item => item.row === element.row && item.col === element.col);
  }
}

// Global constants for grid dimensions
const ROWS = 20;
const COLS = 30;

// Controller
let direction = "right";
let snakeQueue = new Queue();
let food = null;

window.addEventListener("load", start);

function start() {
  // Initialize snake with a 3x3 block
  for (let i = 0; i < 3; i++) {
    snakeQueue.enqueue({ row: 10, col: 10 + i });
  }
  createGrid();
  placeFood();
  document.addEventListener("keydown", handleKeyPress);
  tick();
}

// View
function createGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; // Clear any existing grid content

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-row", row);
      cell.setAttribute("data-col", col);
      grid.appendChild(cell);
    }
  }
}

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
  }
}

function tick() {
  const head = snakeQueue.peekLast();
  let newHead = { row: head.row, col: head.col };

  // Move the snake in the current direction
  switch (direction) {
    case "left":
      newHead.col--;
      break;
    case "right":
      newHead.col++;
      break;
    case "up":
      newHead.row--;
      break;
    case "down":
      newHead.row++;
      break;
  }

  // Wrap around logic
  if (newHead.col < 0) {
    newHead.col = COLS - 1; // Wrap to the right side
  } else if (newHead.col >= COLS) {
    newHead.col = 0; // Wrap to the left side
  }

  if (newHead.row < 0) {
    newHead.row = ROWS - 1; // Wrap to the bottom
  } else if (newHead.row >= ROWS) {
    newHead.row = 0; // Wrap to the top
  }

  // Check for collisions with the snake's body
  if (snakeQueue.contains(newHead)) {
    alert("Game Over!");
    return;
  }

  // Enqueue the new head position
  snakeQueue.enqueue(newHead);

  // If snake eats food
  if (food && newHead.row === food.row && newHead.col === food.col) {
    // Place new food without removing the tail (snake grows)
    placeFood();
  } else {
    // If no food was eaten, dequeue the tail (snake doesn't grow)
    snakeQueue.dequeue();
  }

  updateGrid();
  setTimeout(tick, 200);
}

// Randomly place food on the grid
function placeFood() {
  let row, col;
  do {
    row = Math.floor(Math.random() * ROWS);
    col = Math.floor(Math.random() * COLS);
  } while (snakeQueue.contains({ row, col }));
  food = { row, col };
}

// Update the grid to reflect the current state of the game
function updateGrid() {
  const allCells = document.querySelectorAll(".cell");

  // Clear previous snake and food classes
  allCells.forEach(cell => {
    cell.classList.remove("snake", "food");
  });

  // Draw the snake based on its current segments
  for (let i = 0; i < snakeQueue.items.length; i++) {
    const segment = snakeQueue.items[i];
    const snakeCell = document.querySelector(`[data-row="${segment.row}"][data-col="${segment.col}"]`);
    if (snakeCell) {
      snakeCell.classList.add("snake");
    }
  }

  // Draw the food
  if (food) {
    const foodCell = document.querySelector(`[data-row="${food.row}"][data-col="${food.col}"]`);
    foodCell.classList.add("food");
  }
}
