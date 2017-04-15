// enable strict mode
'use strict';

$(document).ready(function () {
    main();
});

let ctx;

const main = function () {
    initCanvas();
}

const initCanvas = function () {

    // Get canvas by id
    const canvas = $("#canvas").get(0);
    // Set canvas size
    canvas.width = 700;
    canvas.height = 700;
    ctx = canvas.getContext("2d");
    // Define font size and style
    ctx.font = 'normal 35px Bitter';
    // Draw Days names
    drawDaysName();
    // Draw current month
    drawCurrentMonth();
}

const drawDaysName = function () {
    ctx.fillStyle = "#2275df";
    ctx.fillText('Mon', 15, 65);
    ctx.fillText('Tue', 115, 65);
    ctx.fillText('Wen', 215, 65);
    ctx.fillText('Thu', 315, 65);
    ctx.fillText('Fri', 415, 65);
    ctx.fillText('Sat', 515, 65);
    ctx.fillText('Sun', 615, 65);

}

const drawCurrentMonth = function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    // Set current year
    $("#input").val(year);
    drawMonth(year, month);
}

const drawMonth = function (year, month) {
    ctx.clearRect(0, 100, 700, 600);
    const startDayInMonth = firstDayInMonth(year, month);
    const numberCurrentDays = numberDaysInMonth(year, month);
    const prevYear = PreviouslyYear(year, month);
    const prevMonth = PreviouslyMonth(month);
    const numberPrevDays = numberDaysInMonth(prevYear, prevMonth);
    calender.setDays(numberPrevDays, startDayInMonth, numberCurrentDays);
    drawCanvas();

}

const drawCanvas = function () {

    const days = calender.getDays();
    const size = calender.getSize();

    for (let index = 0; index < size; index++) {
        ctx.fillStyle = selectColour(index, days[index]);
        ctx.fillText(days[index], positionX(index), positionY(index));
    }
}

const selectColour = function (index, day) {
    // first week
    if (index < 6) {
        return (day > 20) ? "#666" : "#000";
    // last week
    } else if (index > 27) {
        if (day < 15) {
            return (isSunday(index))? "#e67474" : "#666";
        } else {
            return (isSunday(index))? "#f00" : "#000";
        }
    } else { 
        return (isSunday(index)) ? "#f00" : "#000";
    }
}

//"#e67474";
const isSunday = function (index) {
    return ((index % 7) === 6) ? true : false;
}

const positionX = function (index) {
    return (index % 7) * 100 + 30;
}

const positionY = function (index) {
    return Math.ceil(++index / 7) * 100 + 30;
}

const PreviouslyYear = function (year, month) {
    // if january previously year is one less 
    return (month === 0) ? --year : year;
}

const PreviouslyMonth = function (month) {
    // if january previously month is december 
    return (month === 0) ? 11 : --month;
}

const firstDayInMonth = function (year, month) {
    const date = new Date(year, month, 1);
    //console.log(date);
    const day = date.getDay();
    const newDay = startWithMonday(day);
    //console.log(newDay);
    return newDay;
}

const startWithMonday = function (dayNumber) {
    // Convert day number 
    //  0 : Sunday    => Monday
    //  1 : Monday    => Tuesday
    //  2 : Tuesday   => Wednesday
    //  3 : Wednesday => Thursday
    //  4 : Thursday  => Friday
    //  5 : Friday    => Saturday
    //  6 : Saturday  => Sunday
    return (dayNumber === 0) ? 6 : --dayNumber;
}

const numberDaysInMonth = function (year, month) {
    console.log(`input year = ${year} input month = ${month} ${typeof(month)}`);
    //     April             June               September        November        
    if ((month === 3) || (month === 5) || (month === 8) || (month === 10)) {
        return 30;
        //          February
    } else if (month === 1) {
        return (isLeapYear(year)) ? 29 : 28;
    } else {
        return 31;
    }
}

const isLeapYear = function (year) {
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
        return true;
    } else {
        return false;
    }
}

const calender = {

    size: 6 * 7,
    days: null,

    getSize: function () {
        return this.size;
    },

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
        //console.log(this.days);
    },

    getDays: function () {
        return this.days;
    }
};


const selectDate = function () {

    const year = parseInt($("#input").val());
    const month = parseInt($("#select").val());
    // Draw month if year if valid
    if (!yearError(year)) {
        drawMonth(year, month);
    }

    //console.log(`year = ${year} month = ${month}`);
}

const findEnter = function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        selectDate();
        console.log("find enter");
    }
}

const yearError = function (year) {

    if (isNaN(year)) {
        alert("Please select valid year number!");
        const date = new Date();
        const year = date.getFullYear();
        $("#input").val(year);
        return true;
    }
    return false;
}