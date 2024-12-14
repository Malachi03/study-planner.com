// Get the necessary elements
const addTaskButton = document.getElementById("add-task-button");
const taskInputs = document.getElementById("task-inputs");
const inputTasks = document.getElementById("input-tasks");
const inputStudyTime = document.getElementById("input-study-time");
const submitTaskButton = document.getElementById("submit-task");
const tasksDisplay = document.getElementById("tasks-display");
const timerDisplay = document.getElementById("timer-display");
const timerHeading = document.getElementById("timer-heading"); // Get the heading element

// Show task input fields when "Add Task" button is clicked
addTaskButton.addEventListener("click", () => {
    taskInputs.style.display = "flex";  // Show the input fields
    addTaskButton.style.display = "none"; // Hide the "Add Task" button
    submitTaskButton.style.display = "block"; // Show the submit button
});

let tasks = [];  // List to store tasks
let activeTaskIndex = -1;  // Index to track the active task
let initialStudyTimeInSeconds = 0; // To hold the initial study time in seconds

// Add a task when the submit button is clicked
submitTaskButton.addEventListener("click", () => {
    const taskText = inputTasks.value.trim();
    const studyTime = inputStudyTime.value.trim();

    // Check if both fields have values
    if (taskText && studyTime) {
        // Create a new task object and store it in the tasks array
        const taskItem = { taskText, studyTime };
        tasks.push(taskItem);

        // Create a new list item for the task in the task display
        const taskDisplayItem = document.createElement("li");
        taskDisplayItem.textContent = `${taskText} - ${studyTime} mins`;
        taskDisplayItem.className = "task-item"; // Add a class for easy reference
        tasksDisplay.appendChild(taskDisplayItem); // Add to the task display

        // If this is the first task, set it as the active task and set the timer
        if (tasks.length === 1) {
            activeTaskIndex = 0; // Set the first task as active
            setRemainingTime(studyTime);  // Set timer for the topmost task's time
            initialStudyTimeInSeconds = remainingTimeInSeconds; // Store the initial study time
            updateTimerDisplay(remainingTimeInSeconds);  // Update display immediately
            timerHeading.textContent = taskText;  // Update heading to the topmost task
        }

        // Clear the input fields
        inputTasks.value = "";
        inputStudyTime.value = "";

        // Hide the task inputs and submit button
        taskInputs.style.display = "none"; 
        submitTaskButton.style.display = "none"; // Hide the submit button

        // Show the "Add Task" button again
        addTaskButton.style.display = "block"; 
    } else {
        alert("Please enter a task and a study time.");
    }
});

// Get the start button element
const startButton = document.getElementById('start-button');

// Timer variables
let timerInterval;
let remainingTimeInSeconds = 0; // Track remaining time in seconds

// Event listener for the Start button
startButton.addEventListener('click', () => {
    if (!timerInterval && remainingTimeInSeconds > 0) {
        timerInterval = setInterval(() => {
            remainingTimeInSeconds--;
            updateTimerDisplay(remainingTimeInSeconds);

            // Check if the timer has reached 0
            if (remainingTimeInSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                
                // Automatically move the completed task when the timer runs out
                forwardToCompletedTasks(); // Call the function to forward the task
            }
        }, 1000);
    }
});

// Get the pause button element
const pauseButton = document.getElementById('pause-button');

// Event listener for the Pause button
pauseButton.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval); // Pause the timer
        timerInterval = null; // Reset the interval
    }
});

// Get the reset button element
const resetButton = document.getElementById('reset-button');

// Variable to store the initial time for resetting
let initialTimeInSeconds = 0;

// Event listener for the Reset button
resetButton.addEventListener('click', () => {
    if (initialStudyTimeInSeconds > 0) {
        clearInterval(timerInterval); // Clear any running timer
        timerInterval = null; // Reset the interval
        remainingTimeInSeconds = initialStudyTimeInSeconds; // Reset remaining time
        updateTimerDisplay(initialStudyTimeInSeconds); // Update the display to show initial time
    }
});

// Get the necessary elements for completed tasks
const forwardButton = document.getElementById('forward-button'); // Get the forward button element
const tasksList = document.getElementById('tasks-list'); // Get the completed tasks list
const emptyMessage = document.getElementById('empty-message'); // Get the empty message element

// Event listener for the Forward button
forwardButton.addEventListener('click', () => {
    forwardToCompletedTasks(); // Forward the current active task
});

// Function to forward the current task to completed tasks
function forwardToCompletedTasks() {
    if (activeTaskIndex >= 0 && activeTaskIndex < tasks.length) {
        const completedTask = tasks[activeTaskIndex]; // Get the current active task

        // Create a list item for completed tasks
        const completedItem = document.createElement("li");
        completedItem.innerHTML = `<del>${completedTask.taskText} - ${completedTask.studyTime} mins</del>`;
        tasksList.appendChild(completedItem); // Add to completed tasks list

        // Check if the empty message should be hidden
        emptyMessage.style.display = tasksList.childElementCount === 0 ? 'block' : 'none';

        // Remove the completed task from the tasks array
        tasks.splice(activeTaskIndex, 1); // Remove from tasks array

        // Remove the task from the initial display
        const taskItems = document.querySelectorAll('.task-item');
        if (taskItems[activeTaskIndex]) {
            tasksDisplay.removeChild(taskItems[activeTaskIndex]); // Remove from displayed tasks
        }

        // If there are remaining tasks, set the active task to the next one
        if (tasks.length > 0) {
            activeTaskIndex = 0; // Always move to the topmost task
            const nextTask = tasks[activeTaskIndex]; // Get the next task
            setRemainingTime(nextTask.studyTime);  // Set timer for the next task
            timerHeading.textContent = nextTask.taskText;  // Update heading to the next task
            updateTimerDisplay(remainingTimeInSeconds); // Update timer display for the next task
        } else {
            timerHeading.textContent = "All tasks completed!"; // Update heading if all tasks are done
            remainingTimeInSeconds = 0;  // Stop the timer
            updateTimerDisplay(0);  // Reset the timer display
        }
    }
}

// Function to update the timer display (HH:MM:SS format)
function updateTimerDisplay(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Update the timer display element
    timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to set remaining time (called when a task is submitted)
function setRemainingTime(studyTime) {
    remainingTimeInSeconds = parseInt(studyTime) * 60; // Convert minutes to seconds
}A