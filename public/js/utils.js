//function to get random number withing specific range
function getRandomNumber(max) {
    return parseInt(Math.random() * (max - 0) + 0);
}

//function to get elapsed time
function getFormatedTime(start) {
    let timeDiff = new Date().getTime() - start;
    timeDiff = timeDiff / 1000;
    let seconds = Math.floor(timeDiff % 60);
    let secondsAsString = seconds < 10 ? "0" + seconds : seconds;
    timeDiff = Math.floor(timeDiff / 60);
    let minutes = timeDiff % 60;
    let minutesAsString = minutes < 10 ? "0" + minutes : minutes;
    timeDiff = Math.floor(timeDiff / 60);
    let hours = timeDiff % 24;
    timeDiff = Math.floor(timeDiff / 24);
    let days = timeDiff;
    let totalHours = hours + (days * 24);
    let totalHoursAsString = totalHours < 10 ? "0" + totalHours : totalHours;

    if (totalHoursAsString === "00") {
        return minutesAsString + " minutes " + secondsAsString + " seconds ago ";
    } else {
        return totalHoursAsString + " hours " + minutesAsString + " minutes " + secondsAsString + " seconds ago ";
    }
}