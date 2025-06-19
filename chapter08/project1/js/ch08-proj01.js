
const tax_rate = prompt('Enter tax rate (0.10)');
const shipping_threshold = prompt('Enter shipping threshold (1000)');

/* add loop and other code here ... in this simple exercise we are not
   going to concern ourselves with minimizing globals, etc */

const tbody = document.querySelector('.table-fill tbody');

let cartHTML = '';
cart.forEach(item => {
    cartHTML += generateCartRow(item);
});
cartBody.innerHTML = cartHTML;


const subtotal = calculateSubtotal(cart);
const tax = calculateTax(subtotal, tax_rate);
const shipping = calculateShipping(subtotal, shipping_threshold);
const grandTotal = calculateGrandTotal(subtotal, tax, shipping);


let totalsHTML = '';
totalsHTML += generateTotalRow('Subtotal', subtotal);
totalsHTML += generateTotalRow('Tax', tax);
totalsHTML += generateTotalRow('Shipping', shipping);
totalsHTML += generateTotalRow('Grand Total', grandTotal, true);
cartFooter.innerHTML = totalsHTML;