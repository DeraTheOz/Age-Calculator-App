'use strict';

///////////////////////////////
// Input fields
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');

// Form labels
const labelDay = document.querySelector('.label__day');
const labelMonth = document.querySelector('.label__month');
const labelYear = document.querySelector('.label__year');

// Button
const btnEl = document.querySelector('.btn');
const btnIcon = document.querySelector('.btn__icon');

// Date display
const dayDisplay = document.querySelector('.day-display');
const monthDisplay = document.querySelector('.month-display');
const yearDisplay = document.querySelector('.year-display');

// Regex
const checkNonDigits = /\D/;

//////////////////////////////////////////
// Helper Functions
//////////////////////////////////////////////

// Check for leap years
const isLeapYear = function (year) {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

// Update month display
const updateMonthDisplay = function (monthsPassed) {
	return (monthDisplay.textContent = `${
		monthsPassed < 0 ? '0' : monthsPassed
	}`);
};

// Get number of days in a month in a specific year(leap or non leap years)
const getDaysInMonth = function (month, year) {
	return new Date(year, month + 1, 0).getDate();
};

// Show error message
const showError = function (label, inputElement, message) {
	const inputLabel = label;
	const inputField = inputElement;
	const inputError = inputField.nextElementSibling;

	inputError.textContent = message;
	inputError.classList.add('error');
	inputLabel.classList.add('error');
	inputField.classList.add('input-error');
};

// Clear error message
const clearError = function (label, inputElement) {
	const inputLabel = label;
	const inputField = inputElement;
	const inputError = inputField.nextElementSibling;

	inputError.textContent = '';
	inputError.classList.remove('error');
	inputLabel.classList.remove('error');
	inputField.classList.remove('input-error');
};

// Clear Results
const clearDateResults = function () {
	dayDisplay.textContent = '--';
	monthDisplay.textContent = '--';
	yearDisplay.textContent = '--';
};
//////////////////////////////////////////

//////////////////////////////////////////
// Functions
//////////////////////////////////////////
const validateDayInput = function () {
	const day = dayInput.value.trim();

	if (day === '') {
		showError(labelDay, dayInput, 'This field is required');
		return false;
	}

	if (checkNonDigits.test(day)) {
		showError(labelDay, dayInput, 'Numbers only');
		return false;
	}

	if (day.length < 2) {
		showError(labelDay, dayInput, 'At least two digits');
		return false;
	}

	if (day <= 0) {
		showError(labelDay, dayInput, 'Must be a valid day');
		return false;
	}

	clearError(labelDay, dayInput);
	return true;
};

//////////////////////////////////////////
const validateMonthInput = function () {
	const month = monthInput.value.trim();

	if (month === '') {
		showError(labelMonth, monthInput, 'This field is required');
		return false;
	}

	if (checkNonDigits.test(month)) {
		showError(labelMonth, monthInput, 'Numbers only');
		return false;
	}

	if (month.length < 2) {
		showError(labelMonth, monthInput, 'At least two digits');
		return false;
	}

	if (parseInt(month) === 0) {
		showError(labelMonth, monthInput, 'Must be a valid month');
		return false;
	}

	// check if month is between 1 & 12(0- 11)
	if (/^\d{2}$/.test(month) && parseInt(month) > 12) {
		showError(labelMonth, monthInput, 'Must be a valid month');
		return false;
	}

	clearError(labelMonth, monthInput);
	return true;
};

//////////////////////////////////////////////
const validateYearInput = function () {
	const year = yearInput.value.trim();
	const currentYear = new Date().getFullYear();

	if (year === '') {
		showError(labelYear, yearInput, 'This field is required');
		return false;
	}

	if (checkNonDigits.test(year)) {
		showError(labelYear, yearInput, 'Numbers only');
		return false;
	}

	if (year.length < 4) {
		showError(labelYear, yearInput, 'At least four digits');
		return false;
	}

	if (parseInt(year) === 0) {
		showError(labelYear, yearInput, 'Must be a valid year');
		return false;
	}

	if (parseInt(year) < 1900) {
		showError(labelYear, yearInput, 'Must start from 1900');
		return false;
	}

	// check if year is four digits and not in the future
	if (parseInt(year) > currentYear) {
		showError(labelYear, yearInput, 'Must be in the past');
		return false;
	}

	clearError(labelYear, yearInput);
	return true;
};

//////////////////////////////////////////////
//////////////////////////////////////////////
const validateDates = function (date, month, year) {
	let currentDate = new Date();
	let currentMonth = currentDate.getMonth();
	let monthsPassed = currentMonth - month;

	// Check if the day exceeds number of Days in the selected month
	const daysInMonth = getDaysInMonth(month, year);

	if (parseInt(date) > daysInMonth) {
		showError(labelDay, dayInput, `Must be between 1 & ${daysInMonth}`);
		clearDateResults();
		return false;
	}

	// Check if birthDate is 29th February in a leap year
	if (isLeapYear(year) && parseInt(date) === 29 && month === 1) {
		monthsPassed--;
		clearError(labelDay, dayInput);
		updateMonthDisplay(monthsPassed);
		return true;
	}

	// Check if 29th February was inputted in a non leap year
	if (!isLeapYear(year) && parseInt(date) === 29 && month === 1) {
		showError(labelDay, dayInput, 'Enter a valid date');
		clearDateResults();
		return false;
	}

	// Check if birthDate is 28th February in a leap Year
	if (isLeapYear(year) && parseInt(date) === 28 && month === 1) {
		clearError(labelDay, dayInput);
		updateMonthDisplay(monthsPassed);
		return true;
	}

	// For all other valid dates
	clearError(labelDay, dayInput);
	updateMonthDisplay(monthsPassed);

	return true;
};

//////////////////////////////////////////////
//////////////////////////////////////////////
const calcAge = function () {
	const birthDate = dayInput.value.trim();
	const birthMonth = monthInput.value.trim() - 1;
	const birthYear = yearInput.value.trim();

	const isDateValid = validateDates(birthDate, birthMonth, birthYear);

	// Gaurd clause
	if (!isDateValid) return;

	// Calculate the number of days that has passed from the inputed birthDate to the current day of the month in the current year
	const currentYear = new Date().getFullYear();
	const currentDate = new Date().getTime();
	const specifiedMonth = new Date(
		currentYear,
		birthMonth,
		birthDate
	).getTime();
	const timeDiff = currentDate - specifiedMonth;

	let daysPassed = Math.floor(timeDiff / 86400000);

	let currentAge = currentYear - birthYear;

	yearDisplay.textContent = `${currentAge}`;
	dayDisplay.textContent = `${daysPassed < 0 ? '0' : daysPassed}`;
};

////////////////////////////////////////////////
////////////////////////////////////////////////
// Event Listeners
dayInput.addEventListener('input', validateDayInput);
monthInput.addEventListener('input', validateMonthInput);
yearInput.addEventListener('input', validateYearInput);

//////////////////////////////////////////
btnEl.addEventListener('click', function (e) {
	e.preventDefault();

	const dayIsValid = validateDayInput();
	const monthIsValid = validateMonthInput();
	const yearIsValid = validateYearInput();

	if (dayIsValid && monthIsValid && yearIsValid) {
		calcAge();
	} else {
		clearDateResults();
		return false;
	}
});
