import { getClients } from './data.js';


const dashboardClientsList = document.getElementById('dashboard-clients-list');

function renderDashboardClients() {
    if (!dashboardClientsList) return;

    const clients = getClients() || [];
    dashboardClientsList.innerHTML = '';

    if (clients.length === 0) {
        dashboardClientsList.innerHTML = `<tr><td colspan="3" style="text-align:center;">No clients recorded yet.</td></tr>`;
        return;
    }





    clients.forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${client.name}</strong></td>
            <td>${client.email}</td>
            <td>${client.company || '-'}</td>
        `;
        dashboardClientsList.appendChild(tr);
    });
}


renderDashboardClients();
