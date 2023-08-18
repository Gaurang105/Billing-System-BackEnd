function calculateProductTax(price, quantity) {
    let tax = 200; 
    if (price > 1000 && price <= 5000) {
        tax = price * 0.12; // Tax PA
    } else if (price > 5000) {
        tax = price * 0.18; // Tax PB
    }

    let finalTax = tax * quantity;
    return parseFloat(finalTax.toFixed(2));
}

function calculateServiceTax(price, quantity) {
    let tax = 100; 

    if (price > 1000 && price <= 8000) {
        tax = price * 0.10; // Tax SA
    } else if (price > 8000) {
        tax = price * 0.15; // Tax SB
    }

    let finalTax = tax * quantity;
    return parseFloat(finalTax.toFixed(2));
}

module.exports = { calculateProductTax, calculateServiceTax };
