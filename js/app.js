// enable strict mode
'use strict';

$(document).ready(function () {
    main();
});

const main = function () {
    initCanvas();
    console.log(firstDayInMonth(2017,4));
    calender.setDays(31,0,31);
}

const initCanvas = function() {

    const cols = 7;
    const rows = 7;
    const scale = 100;
    
    const canvas = $("#canvas").get(0);
    canvas.width = cols * scale;
    canvas.height = rows * scale;
    const ctx = canvas.getContext("2d");
}

const firstDayInMonth = function(year, month) {
    const date = new Date(year, month, 1);
    //console.log(date);
    const day = date.getDay();
    const newDay = startWithMonday(day);
    //console.log(newDay);
    return newDay;
}

const startWithMonday = function(dayNumber) {
    // Convert day number 
    //  0 : Sunday    => Monday
    //  1 : Monday    => Tuesday
    //  2 : Tuesday   => Wednesday
    //  3 : Wednesday => Thursday
    //  4 : Thursday  => Friday
    //  5 : Friday    => Saturday
    //  6 : Saturday  => Sunday
    
    if (dayNumber === 0) {
        return 6;
    } else { 
        return --dayNumber;
    }
}

const numberDaysInMonth = function(year, month) {
    //     April             June               September        November        
    if ((month ===  3) || (month ===  5) || (month ===  8) || (month === 10)) {
        return 30;
    //          February
    } else if (month === 1) { 
        return isLeapYear(year)? 29 : 28;
    } else {
        return 31;
    }
}

const isLeapYear = function(year) {
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
        return true;
    } else {
        return false;
    }
}

const calender = {
    
    size: 6*7,
    days: null,

    setDays: function(numberDaysInPreviousMonth, startDayInMonth, numberDaysInMonth) {
        this.days = [];
        for (let index = 0; index < this.size; index++) {
            // Previously month
            if (index < startDayInMonth) {
                this.days[index] = numberDaysInPreviousMonth - startDayInMonth + index + 1 ;
            // This mount
            } else if (index >= (startDayInMonth + numberDaysInMonth)) {
                this.days[index] = index - (startDayInMonth + numberDaysInMonth) + 1;
            // Next Mount
            } else {
                this.days[index] = index - startDayInMonth + 1;
            }
        }
        console.log(this.days);
    }
};
