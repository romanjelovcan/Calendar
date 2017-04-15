//////////////////////////////////////////////
//                                          //
//  This file is part of HTML5 Calender     //
//                                          //
//                                          //
//        Copyright RomanJ 2017             //
//                                          //
//////////////////////////////////////////////

// enable strict mode
'use strict';

// run when the page Document Object Model (DOM) is ready.
$(document).ready(function () {
    // Store all holiday from holidays.json file.
    const allHolidays = loadHolidays();
    // Set global variable allHolidays. 
    global.setHolidays(allHolidays);
    // Initial Canvas on page load.
    initCanvas();
});

// Global variables
const global = {
    // All holidays from holidays.json file.
    allHolidays: null,
    setHolidays: function (holidays) {
        this.allHolidays = holidays;
    },
    getHolidays: function () {
        return this.allHolidays;
    },
    // Drawing object for the canvas.
    ctx: null,
    setCtx: function (ctx) {
        this.ctx = ctx;
    },
    getCtx: function () {
        return this.ctx;
    }
};

// Generate http request to read holidays from file.
const loadHolidays = function () {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "/configuration/holidays.json", false);
    httpRequest.send();
    return JSON.parse(httpRequest.responseText);
};

const initCanvas = function () {
    // Get canvas by id.
    const canvas = $("#canvas").get(0);
    // Set canvas size.
    canvas.width = 700;
    canvas.height = 700;
    // Drawing object for the canvas.
    const ctx = canvas.getContext("2d");
    // Define font size and style.
    ctx.font = 'normal 35px Bitter';
    // Set global variable.
    global.setCtx(ctx);
    // Draw Days names.
    drawDaysName();
    // Draw current month.
    drawCurrentMonth();
};

const drawDaysName = function () {
    // Drawing object for the canvas.
    const ctx = global.getCtx();
    // Define font colour for day names. 
    ctx.fillStyle = "#2275df";
    // Draw text to canvas at x, y position.
    ctx.fillText('Mon', 15, 65);
    ctx.fillText('Tue', 115, 65);
    ctx.fillText('Wen', 215, 65);
    ctx.fillText('Thu', 315, 65);
    ctx.fillText('Fri', 415, 65);
    ctx.fillText('Sat', 515, 65);
    ctx.fillText('Sun', 615, 65);
};

const drawCurrentMonth = function () {
    // Get current date.
    const date = new Date();
    // Get current year.
    const year = date.getFullYear();
    // Get currnet month.
    const month = date.getMonth();
    // Set current year. 
    $("#input").val(year);
    // Set current month.
    $("#select").val(month);
    // Draw current year and month.
    drawMonth(year, month);
};

const drawMonth = function (year, month) {
    // Drawing object for the canvas.
    const ctx = global.getCtx();
    // get all holiday from global object.
    const allHolidays = global.getHolidays();
    // Clear all canvas except days names.
    ctx.clearRect(0, 100, 700, 600);
    // Get all holidays in selected year and month.
    const holidays = holidaysInMonth(allHolidays, year, month);
    // Find first day in selected year and month.
    const startDayInMonth = firstDayInMonth(year, month);
    // Find number days in selected year and month.
    const numberCurrentDays = numberDaysInMonth(year, month);
    // Find previously year from selected year and month.
    const prevYear = PreviouslyYear(year, month);
    // Find previously month from selected year and month.
    const prevMonth = PreviouslyMonth(month);
    // Find number days in previously month from selected year and month.
    const numberPrevDays = numberDaysInMonth(prevYear, prevMonth);
    // Set array of Days in selected year and month.
    calender.setDays(numberPrevDays, startDayInMonth, numberCurrentDays);
    // Draw selected year and month on canvas.
    drawCanvas(holidays);
};

const holidaysInMonth = function (allHolidays, year, month) {
    // Create empty array of holidays.
    const holidays = [];
    // Check all holidays from holidays.json and add to holidays array if holidays are in this year and month.
    for (let index = 0; index < allHolidays.holidays.length; index++) {
        if (allHolidays.holidays[index].year === year || allHolidays.holidays[index].year === "repeat") {
            if (allHolidays.holidays[index].month === month) {
                holidays.push(allHolidays.holidays[index].day);
            }
        }
    }
    // Return array of all holidays in this year and month.
    return holidays;
};

const firstDayInMonth = function (year, month) {
    // Create date object for first day in selected year and month.
    const date = new Date(year, month, 1);
    // Get first day in month.
    const day = date.getDay();
    // Convert day to new format where monday is first day in week and sunday in last day in week.
    const newDay = startWithMonday(day);
    return newDay;
};

const startWithMonday = function (dayNumber) {
    // Convert day number. 
    //  0 : Sunday    => Monday
    //  1 : Monday    => Tuesday
    //  2 : Tuesday   => Wednesday
    //  3 : Wednesday => Thursday
    //  4 : Thursday  => Friday
    //  5 : Friday    => Saturday
    //  6 : Saturday  => Sunday
    return (dayNumber === 0) ? 6 : --dayNumber;
};

const numberDaysInMonth = function (year, month) {
    //     April             June               September        November        
    if ((month === 3) || (month === 5) || (month === 8) || (month === 10)) {
        return 30;
    //          February
    } else if (month === 1) {
        return (isLeapYear(year)) ? 29 : 28;
    } else {
        return 31;
    }
};

const isLeapYear = function (year) {
    // Check if selected year if leap year.
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
        return true;
    } else {
        return false;
    }
};

const PreviouslyYear = function (year, month) {
    // If january previously year is one less. 
    return (month === 0) ? --year : year;
};

const PreviouslyMonth = function (month) {
    // If january previously month is december. 
    return (month === 0) ? 11 : --month;
};

const drawCanvas = function (holidays) {
    // Get days from calender object.
    const days = calender.getDays();
    // Get calender size (number days to draw in one month).
    const size = calender.getSize();
    // Drawing object for the canvas.
    const ctx = global.getCtx();
    // Draw all days from calender object. 
    for (let index = 0; index < size; index++) {
        // Change colour : red = sunday, green = holiday, grey = previously or next month.  
        ctx.fillStyle = selectColour(holidays, index, days[index]);
        // Draw text on canvas at x, y position.
        ctx.fillText(days[index], positionX(index), positionY(index));
    }
};

const selectColour = function (holidays, index, day) {
    // Previously month.
    if (index < 6) {
        if (day > 20) {
            return "#666";
        } else {
            return specialDay(holidays, index, day);
        }
    // Next month.
    } else if (index > 27) {
        if (day < 15) {
            return (isSunday(index)) ? "#e67474" : "#666";
        } else {
            return specialDay(holidays, index, day);
        }
    // This month.
    } else {
        return specialDay(holidays, index, day);
    }
};

const isSunday = function (index) {
    // Check if day is sunday.
    return ((index % 7) === 6) ? true : false;
};

const isHoliday = function (holidays, day) {
    // Check is this day is holiday.
    for (let index = 0; index < holidays.length; index++) {
        if (holidays[index] === day) {
            return true;
        }
    }
    return false;
}

const specialDay = function (holidays, index, day) {
    // Check if is a holiday, sunday or normal day.
    if (isHoliday(holidays, day)) {
        return "#21d421";
    } else {
        return (isSunday(index)) ? "#f00" : "#000";
    }
}

const positionX = function (index) {
    // Canvas x position calculation.
    return (index % 7) * 100 + 30;
};

const positionY = function (index) {
    // Canvas y position calculation.
    return Math.ceil(++index / 7) * 100 + 30;
};

const calender = {

    size: 6 * 7,
    getSize: function () {
        return this.size;
    },

    days: null,
    setDays: function (numberDaysInPreviousMonth, startDayInMonth, numberDaysInMonth) {
        this.days = [];
        for (let index = 0; index < this.size; index++) {
            // Previously month
            if (index < startDayInMonth) {
                this.days[index] = numberDaysInPreviousMonth - startDayInMonth + index + 1;
            // Next Mount
            } else if (index >= (startDayInMonth + numberDaysInMonth)) {
                this.days[index] = index - (startDayInMonth + numberDaysInMonth) + 1;
            // This mount
            } else {
                this.days[index] = index - startDayInMonth + 1;
            }
        }
    },
    getDays: function () {
        return this.days;
    }
};

const selectDate = function () {
    // Get year from input.
    const year = parseInt($("#input").val());
    // Get month from selection.
    const month = parseInt($("#select").val());
    // Draw month if year if valid.
    if (!yearError(year)) {
        drawMonth(year, month);
    }
};

const findEnter = function (event) {
    // Draw calender if enter is pressed.
    if (event.keyCode == 13) {
        event.preventDefault();
        selectDate();
    }
};

const yearError = function (year) {
    // Check if year is not a valid number.
    if (isNaN(year)) {
        // Create alert when user set wrong year.
        alert("Please select valid year number!");
        // Create currents date.
        const date = new Date();
        // Get current year.
        const year = date.getFullYear();
        // Restore year to current year.
        $("#input").val(year);
        return true;
    }
    return false;
};