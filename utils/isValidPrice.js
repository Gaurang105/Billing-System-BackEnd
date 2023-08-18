
function isValidPrice(price) {
    if (price === undefined || price === null || price === '') {
        return false;
    }
    return typeof price === 'number' && price >= 0;
}

module.exports = {isValidPrice};

