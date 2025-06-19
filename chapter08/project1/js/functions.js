/* define your functions here */
function calculateItemTotal(item) {
    return item.product.price * item.quantity;
}

function calculateSubtotal(cart) {
    return cart.reduce((total,item)=>total+calculateItemTotal(item),0);
}

function calculateTax(subtotal, taxRate) {
    return subtotal * taxRate;
}

function calculateShipping(subtotal, threshold) {
    return subtotal >= threshold ? 0 : 55;
}

function calculateGrandTotal(subtotal, tax, shipping) {
    return subtotal + tax + shipping;
}

function generateCartRow(item) {
    const total = calculateItemTotal(item);
    
    return `
        <tr>
            <td><img src="/chapter08/project1/images/${item.product.filename}" class="painting"></td>
            <td>${item.product.title}</td>
            <td class="center">${item.quantity}</td>
            <td class="right">${formatCurrency(item.product.price)}</td>
            <td class="right">${formatCurrency(total)}</td>
        </tr>
    `;

}

function generateTotalRow(label, value, isFocus = false) {
    const focusClass = isFocus ? 'focus' : '';
    return `
        <tr class="totals">
            <td colspan="4" class="${focusClass}">${label}</td>
            <td class="${focusClass}">${formatCurrency(value)}</td>
        </tr>
    `;
}
        
