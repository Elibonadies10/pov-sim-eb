/*
 * Returns a random int between minVal and maxVal, inclusive
*/
function getRandomInt(minVal, maxVal) {
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
}

module.exports = {
    getRandomInt: getRandomInt,
};
