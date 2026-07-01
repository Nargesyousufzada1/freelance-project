import { getClients, saveClients } from './data.js';

const clientForm = document.getElementById('client-form');
const clientIdInput = document.getElementById('client-id');
const clientNameInput = document.getElementById('client-name');
const clientEmailInput = document.getElementById('client-email');
const clientCompanyInput = document.getElementById('client-company');
const clientNotesInput = document.getElementById('client-notes');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const clientsList = document.getElementById('clients-list');

const API_URL = 'https://randomuser.me/api/?results=5&nat=us';

async function fetchInitialClients() {
    let clients = getClients();
    if (clients && clients.length > 0) {
        renderClients();
        return;
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error in connection');
        const data = await response.json();
        
        const apiClients = data.results.map(user => ({
            id: String(Date.now() + Math.random()),
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            company: 'Freelance Co.',
            notes: 'API Automated Profile'
        }));
        
        saveClients(apiClients);
        renderClients();
    } catch (error) {
        console.error('Issue in receiving data:', error);
        alert('There is a problem fetching external data, you can add clients manually');
        renderClients();
    }
}

function renderClients() {
    const clients = getClients() || [];
    clientsList.innerHTML = '';

    if (clients.length === 0) {
        clientsList.innerHTML = `<tr><td colspan="5" style="text-align:center;">No clients recorded.</td></tr>`;
        return;
    }

    clients.forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.company || '-'}</td>
            <td>${client.notes || '-'}</td>
            <td>
                <button class="btn-edit" data-id="${client.id}">Edit</button>
                <button class="btn-delete" data-id="${client.id}">Delete</button>
            </td>
        `;
        clientsList.appendChild(tr);
    });
}

clientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = clientIdInput.value;
    const name = clientNameInput.value.trim();
    const email = clientEmailInput.value.trim();
    const company = clientCompanyInput.value.trim();
    const notes = clientNotesInput.value.trim();

    if (!name || !email) {
        alert('Please fill required fields marked with *.');
        return;
    }

    let clients = getClients() || [];

    if (id) {
        // Edit mode
        clients = clients.map(client => 
            client.id === id ? { ...client, name, email, company, notes } : client
        );
    } else {
        // New client mode
        const newClient = {
            id: String(Date.now()),
            name,
            email,
            company,
            notes
        };
        clients.push(newClient);
    }

    saveClients(clients);
    renderClients();
    resetFormState();
});

clientsList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    let clients = getClients() || [];

    if (e.target.classList.contains('btn-delete')) {
        if (confirm('Are you sure you want to delete this client?')) {
            clients = clients.filter(client => client.id !== id);
            saveClients(clients);
            renderClients();
            if (clientIdInput.value === id) resetFormState();
        }
    }

    if (e.target.classList.contains('btn-edit')) {
        const clientToEdit = clients.find(client => client.id === id);
        if (clientToEdit) {
            clientIdInput.value = clientToEdit.id;
            clientNameInput.value = clientToEdit.name;
            clientEmailInput.value = clientToEdit.email;
            clientCompanyInput.value = clientToEdit.company;
            clientNotesInput.value = clientToEdit.notes;
            
            submitBtn.textContent = 'Updating Changes';
            cancelBtn.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
cancelBtn.addEventListener('click', resetFormState);

function resetFormState() {
    clientForm.reset();
    clientIdInput.value = '';
    submitBtn.textContent = 'Save The Client';
    cancelBtn.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', fetchInitialClients);

document.addEventListener('DOMContentLoaded', renderDashboardClients);




