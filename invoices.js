const clients = window.clients || [
    { id: "C101", name: "Acme Corp" },
    { id: "C102", name: "Stark Industries" },
    { id: "C103", name: "Wayne Enterprises" }
];

let invoices = window.invoices || [
    { id: "INV001", clientId: "C101", title: "Web Development", description: "Built landing page", amount: 1500, date: "2026-06-01", isPaid: true },
    { id: "INV002", clientId: "C102", title: "Cloud Consulting", description: "AWS Architecture review", amount: 3200, date: "2026-06-15", isPaid: false }
];

const invoiceForm = document.getElementById('invoiceForm');
const clientSelect = document.getElementById('clientSelect');
const invoiceTableBody = document.getElementById('invoiceTableBody');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const invoiceIdInput = document.getElementById('invoiceId');


function init() {
    populateClientDropdown();
    render();
    
    invoiceForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
}

function populateClientDropdown() {
    clientSelect.innerHTML = '<option value="">-- Select a Client --</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id; 
        option.textContent = client.name;
        clientSelect.appendChild(option);
    });
}


function render() {
   
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices.reduce((sum, inv) => inv.isPaid ? sum + inv.amount : sum, 0);
    const totalUnpaid = invoices.reduce((sum, inv) => !inv.isPaid ? sum + inv.amount : sum, 0);

    // Update Totals UI
    document.getElementById('totalInvoiced').textContent = totalInvoiced.toFixed(2);
    document.getElementById('totalPaid').textContent = totalPaid.toFixed(2);
    document.getElementById('totalUnpaid').textContent = totalUnpaid.toFixed(2);

    invoiceTableBody.innerHTML = invoices.map(invoice => {
        // Map Client ID to Client Name
        const client = clients.find(c => c.id === invoice.clientId);
        const clientName = client ? client.name : "Unknown Client";

        return `
            <tr>
                <td>${clientName} (ID: ${invoice.clientId})</td>
                <td>${invoice.title}</td>
                <td>${invoice.description}</td>
                <td>$${invoice.amount.toFixed(2)}</td>
                <td>${invoice.date}</td>
                <td>
                    <span class="${invoice.isPaid ? 'paid' : 'unpaid'}">${invoice.isPaid ? 'Paid' : 'Unpaid'}</span>
                </td>
                <td>
                    <button onclick="togglePaidStatus('${invoice.id}')">Toggle Paid</button>
                    <button onclick="editInvoice('${invoice.id}')">Edit</button>
                    <button onclick="deleteInvoice('${invoice.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}


function handleFormSubmit(e) {
    e.preventDefault();

    const id = invoiceIdInput.value;
    const clientId = clientSelect.value;
    const title = document.getElementById('serviceTitle').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('invoiceDate').value;

    if (id) {
        // Update Action
        const index = invoices.findIndex(inv => inv.id === id);
        if (index !== -1) {
            invoices[index] = { ...invoices[index], clientId, title, description, amount, date };
        }
    } else {
        // Create Action
        const newInvoice = {
            id: 'INV' + Date.now(),
            clientId,
            title,
            description,
            amount,
            date,
            isPaid: false 
        };
        invoices.push(newInvoice);
    }

    resetForm();
    render();
}

// Toggle Paid/Unpaid Status
window.togglePaidStatus = function(id) {
    invoices = invoices.map(inv => {
        if (inv.id === id) {
            return { ...inv, isPaid: !inv.isPaid };
        }
        return inv;
    });
    render();
};

// Edit Setup (Populates Form)
window.editInvoice = function(id) {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    invoiceIdInput.value = invoice.id;
    clientSelect.value = invoice.clientId;
    document.getElementById('serviceTitle').value = invoice.title;
    document.getElementById('description').value = invoice.description;
    document.getElementById('amount').value = invoice.amount;
    document.getElementById('invoiceDate').value = invoice.date;

    submitBtn.textContent = "Update Invoice";
    cancelBtn.style.display = "inline-block";
};

// Delete Action
window.deleteInvoice = function(id) {
    if (confirm("Are you sure you want to delete this invoice?")) {
        invoices = invoices.filter(inv => inv.id !== id);
        render();
    }
};

// Form Reset Utility
function resetForm() {
    invoiceForm.reset();
    invoiceIdInput.value = '';
    submitBtn.textContent = "Create Invoice";
    cancelBtn.style.display = "none";
}

init();
