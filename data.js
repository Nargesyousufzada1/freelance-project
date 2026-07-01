export function getClients() {
    return JSON.parse(localStorage.getItem('clients')) || [];
}

export function saveClients(clientsArray) {
    localStorage.setItem('clients', JSON.stringify(clientsArray));
}

export function getInvoices() {
    return JSON.parse(localStorage.getItem('invoices')) || [];
}

export function saveInvoices(invoicesArray) {
    localStorage.setItem('invoices', JSON.stringify(invoicesArray));
}