const axios = require('axios');
const Salesman = require("../models/Salesman");

const BASE_URL = 'http://localhost:8887/opencrx-rest-CRX';
const AUTH = {
    username: 'guest',
    password: 'guest'
};

const http = require('http');

// It was a lot of problems with OpenCRX rejecting rapid requests. So we create an axios instance with keep-alive and limited sockets.
const httpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 10,
    timeout: 60000
});

const axiosInstance = axios.create({
    httpAgent: httpAgent,
    timeout: 120000,
    auth: AUTH,
    headers: { 'Accept': 'application/json' }
});

function extractIdFromHref(href) {
    if (!href) return null;
    const parts = href.split('/');
    return parts[parts.length - 1];
}

async function fetchCrx(path) {
    try {
        const url = `${BASE_URL}/${encodeURI(path)}`;
        const response = await axiosInstance.get(url);

        return response.data.objects || response.data;
    } catch (error) {
        const status = error.response ? error.response.status : 'Unknown';
        console.error(`OpenCRX Error [${path}] Status: ${status} | ${error.message}`);
        return null;
    }
}

async function getOrderPositions(orderId) {
    const path = `org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${orderId}/position`;
    const positions = await fetchCrx(path);

    if (!positions || !Array.isArray(positions) || positions.length === 0) {
        return { productNames: "N/A", totalQuantity: 0 };
    }

    const names = [];
    let totalQty = 0;

    for (const pos of positions) {
        const name = pos.productDescription || pos.name || "Unknown Product";
        const qty = parseFloat(pos.quantity) || 0;

        names.push(name);
        totalQty += qty;
    }

    return {
        productNames: names.join(", "),
        quantity: totalQty
    };
}

async function getSalesDataForEmployee(salesmanId, year) {
    const enrichedOrders = [];
    const targetYear = parseInt(year);

    console.log(`Starting fetching data for salesman: ${salesmanId}, year: ${year}`);

    try {
        const [allOrders, allAccounts] = await Promise.all([
            fetchCrx('org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder'),
            fetchCrx('org.opencrx.kernel.account1/provider/CRX/segment/Standard/account')
        ]);

        if (!allOrders || !Array.isArray(allOrders)) {
            console.warn("No orders found.");
            return [];
        }

        const clientMap = new Map();
        if (allAccounts && Array.isArray(allAccounts)) {
            allAccounts.forEach(acc => {
                const id = extractIdFromHref(acc['@href'] || acc.identity);
                if (id) {
                    clientMap.set(id, {
                        ranking: acc.accountRating || 0,
                        name: acc.fullName || acc.name || "Client"
                    });
                }
            });
        }

        for (const order of allOrders) {
            // Filtering sales orders
            const repHref = order.salesRep ? (order.salesRep['@href'] || order.salesRep) : null;
            const repId = extractIdFromHref(repHref);
            if (repId !== salesmanId) continue;

            // Filtering by year
            const createdDate = new Date(order.createdAt);
            if (createdDate.getFullYear() !== targetYear) continue;

            const customerHref = order.customer ? (order.customer['@href'] || order.customer) : null;
            const customerId = extractIdFromHref(customerHref);
            const clientData = clientMap.get(customerId) || { ranking: 0, name: "Unknown" };

            // OpenCRX rejects rapid requests sometimes, so we add a tiny delay
            await new Promise(r => setTimeout(r, 50));
            const orderId = extractIdFromHref(order.identity);

            const positionData = await getOrderPositions(orderId);

            enrichedOrders.push({
                orderId: orderId,
                productName: positionData.productNames,
                clientName: clientData.name,
                clientRanking: clientData.ranking.toString(),
                quantity: positionData.quantity,
                closingProbability: 50, // Mock value (I couldn't find this in OpenCRX, unfortunately)
                amount: parseFloat(order.totalAmount) || 0,
                currency: order.contractCurrency
            });
        }

        console.log(`Processed ${enrichedOrders.length} orders successfully.`);
        return enrichedOrders;

    } catch (err) {
        console.error("Critical error in getSalesDataForEmployee:", err.message);
        throw err;
    }
}

async function getCrxIdByGovernmentId(governmentId) {
    const accounts = await fetchCrx('org.opencrx.kernel.account1/provider/CRX/segment/Standard/account');

    if (!accounts || !Array.isArray(accounts)) return null;

    const targetId = String(governmentId);

    const foundAccount = accounts.find(acc => String(acc.governmentId) === targetId);

    if (foundAccount) {
        return extractIdFromHref(foundAccount.href || foundAccount['@href'] || foundAccount.identity);
    }

    return null;
}

// Also, we should think about the bonus calculation logic, for now it's a simple example
const calculateOrderBonus = (order) => {
    if(order.productName === "Hoover for big companies"){
        const rankingFactor = ((6 - order.clientRanking) * 5); // Lower ranking means better client

        const baseBonus = 100 / order.closingProbability;

        const total = baseBonus * rankingFactor * (order.quantity / 2);

        return Math.round(total);
    } else {
        const rankingFactor = ((6 - order.clientRanking) * 3);

        const baseBonus = 100 / order.closingProbability;

        const total = baseBonus * rankingFactor * (order.quantity / 2);

        return Math.round(total);
    }
};


module.exports = { getSalesDataForEmployee, getCrxIdByGovernmentId, calculateOrderBonus };