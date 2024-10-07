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

const toast = document.querySelector('.hidden');

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
const validateDates = function (date, month, year) {
	// Check if the day exceeds number of Days in the selected month
	const daysInMonth = getDaysInMonth(month, year);

	if (parseInt(date) > daysInMonth) {
		showError(labelDay, dayInput, `Must be between 1 & ${daysInMonth}`);
		clearDateResults();
		return false;
	}

	// Check if birthDate is 29th February in a leap year
	if (isLeapYear(year) && parseInt(date) === 29 && month === 1) {
		clearError(labelDay, dayInput);
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
		return true;
	}

	// For all other valid dates
	clearError(labelDay, dayInput);
	return true;
};

//////////////////////////////////////////////
const dateDifference = function (startDate, endDate) {
	let years = endDate.getFullYear() - startDate.getFullYear();
	let months = endDate.getMonth() - startDate.getMonth();
	let days = endDate.getDate() - startDate.getDate();

	// Check if day of the month in endDate is earlier than startDate
	if (days < 0) {
		months--;
		days += new Date(
			endDate.getFullYear(),
			endDate.getMonth(),
			0
		).getDate();
	}

	// Check if month in endDate is earlier than startDate
	if (months < 0) {
		years--;
		months += 12;
	}

	return { years, months, days };
};

//////////////////////////////////////////////
const calcAge = function () {
	const birthDate = parseInt(dayInput.value.trim());
	const birthMonth = parseInt(monthInput.value.trim()) - 1;
	const birthYear = parseInt(yearInput.value.trim());

	// Current date
	const today = new Date();
	let currentYear = today.getFullYear();
	let currentMonth = today.getMonth();
	let currentDate = today.getDate();

	// Check if the birth date is in the future
	if (
		birthYear > currentYear ||
		(birthYear === currentYear && birthMonth > currentMonth) ||
		(birthYear === currentYear &&
			birthMonth === currentMonth &&
			birthDate > currentDate)
	) {
		clearDateResults();
		toast.classList.add('active');
		return;
	} else toast.classList.remove('active');

	// Validate input dates
	const isDateValid = validateDates(birthDate, birthMonth, birthYear);

	// Gaurd clause for input dates
	if (!isDateValid) return;

	// Get years, months and days difference using the dateDifference function
	const ageDifference = dateDifference(
		new Date(birthYear, birthMonth, birthDate),
		today
	);

	// Update display with calculated results
	yearDisplay.textContent = `${ageDifference.years}`;
	updateMonthDisplay(ageDifference.months);
	dayDisplay.textContent = `${ageDifference.days}`;
};

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
