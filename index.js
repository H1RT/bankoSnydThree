var enteredNumbers = [];

document.getElementById('submitNumber').addEventListener('click', function () {
    var number = document.getElementById('inputNumber').value;

    //Convert number to integer
    number = Number(number);

    //Check if integer is a number
    if (!number || isNaN(number)) {
        alert('Please enter a number');
    } else if (number < 1 || number > 90) { //Check if number is between 1 and 90
        alert('Please enter a number between 1 and 90');
    } else if (enteredNumbers.includes(number)) {
        alert('Number already entered');
    } else {
        //Add number to array
        enteredNumbers.push(number);

        //Clear and focus input
        document.getElementById('inputNumber').value = '';
        document.getElementById('inputNumber').focus();

        //Sort array
        enteredNumbers.sort(function (a, b) { return a - b });

        //Display entered numbers on page
        document.getElementById('numbers-entered').innerHTML = enteredNumbers.join(', ');

        checkIf5NumbersOfTens();
    }
});

function checkIf5NumbersOfTens() {
    let tens = [];

    let matchingRows = 1;
    if (document.getElementById('tworow').checked) {
        matchingRows = 2;
    } else if (document.getElementById('fullplate').checked) {
        matchingRows = 3;
    }

    if (enteredNumbers.length >= (5 * matchingRows)) {
        for (let number of enteredNumbers) {
            if (number == 90) {
                tens.push(8);
            } else {
                tens.push(Math.floor(number / 10));
            }
        }
    }

    //Distinct values in array
    let distinctTens = tens.filter((item, i, ar) => ar.indexOf(item) === i);

    if (distinctTens.length >= 5) {
        checkNumbersForMatchingRows(matchingRows);
    }
}

function checkNumbersForMatchingRows(matchingRows) {
    console.log("starting checking numbers!");
    let startTime = new Date();
    const FAILSAFE = 100000;
    let seed = 0;
    let matchFound = false;
    while (!matchFound && seed < FAILSAFE) {
        let plate = generatePlate(seed.toString());
        let rowsWon = 0;
        for (let row of plate) {
            if (arrayAinArrayB(row, enteredNumbers)) {
                rowsWon++;
                if (rowsWon == matchingRows) {
                    matchFound = true;
                    alert("Der er et match! Seed: " + seed);
                    document.getElementById('winner-seed').innerHTML = "Vinder seed: " + seed;
                    document.getElementById('time-seconds').innerHTML = "Match fundet på: " + (new Date().getTime() - startTime) / 1000 + " sekunder"
                }
            }
        }
        seed++;
    }

    if (!matchFound) {
        alert("Der er ikke et match");
        document.getElementById('time-seconds').innerHTML = "Match fundet på: " + (new Date().getTime() - startTime) / 1000 + " sekunder"
    }
}

function arrayAinArrayB(a, b) {
    return a.every(function (i) {
        return b.indexOf(i) > -1;
    });
}

function generatePlate(seed) {
    Math.seedrandom(seed);
    var cols = [];
    for (var i = 0; i < 9; i++) {
        var col = generate_col(i);
        cols.push(col);
        
    }
    var rows_choose = generate_rows_check();
    let plate = [[], [], []];

    for (let i = 0; i < 3; i++) {
        let rowValues = rows_choose[i];

        for (let j = 0; j < cols.length; j++) {
            if (rowValues.includes(j + 1)) {
                plate[i].push(cols[j][i]);
            }
        }
    }

    return plate;
}

function generate_col(i) {
    var col = Array.from({ length: 3 }, () => gen_int(i));
    while (hasDuplicates(col) == true) {
        var col = Array.from({ length: 3 }, () => gen_int(i));
    }
    return (col.sort());
}

function generate_rows_check() {
    var rows = new Array(generate_row(), generate_row(), generate_row())
    while (!contains_digits(rows)) {
        var rows = new Array(generate_row(), generate_row(), generate_row())
    }
    return (rows)
}

function generate_row() {
    var row = Array.from({ length: 5 }, () => gen_int(100));
    while (hasDuplicates(row) == true) {
        var row = Array.from({ length: 5 }, () => gen_int(100));
    }
    return (row.sort());
}

function gen_int(i) {
    var number = Math.floor(Math.random() * 10 + (i * 10))
    while (number === 0) {
        var number = Math.floor(Math.random() * 10 + (i * 10))
    }
    if (i === 8) {
        var number = Math.floor(Math.random() * 11 + 80)
    }
    if (i === 100) {
        var number = Math.ceil(Math.random() * 9)
    }
    return number
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

function contains_digits(rows) {
    var concat = rows[0].concat(rows[1], rows[2]);
    for (var i = 1; i < 9; i++) {
        if (concat.indexOf(i) === -1) {
            return (false)
        }
    }

    if (concat.indexOf(9) === -1) {
        return (false)
    }
    return (true)
}