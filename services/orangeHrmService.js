const axios = require('axios');
const qs = require('querystring');

const BASE_URL = 'http://localhost:8888/symfony/web/index.php';
const AUTH_CONFIG = {
    client_id: 'api_oauth_id',
    client_secret: 'oauth_secret',
    grant_type: 'password',
    username: 'demouser',
    password: '*Safb02da42Demo$',
    scope: 'admin'
};

async function getAccessToken() {
    const params = new URLSearchParams();
    for (const key in AUTH_CONFIG) {
        params.append(key, AUTH_CONFIG[key]);
    }

    try {
        const response = await axios.post(`${BASE_URL}/oauth/issueToken`, params);
        return response.data.access_token;
    } catch (error) {
        console.error("OrangeHRM Auth Error:", error.response ? error.response.data : error.message);
        throw new Error("Failed to authenticate with OrangeHRM");
    }
}

// M_FR5: Fetch master data of salesmen
async function getAllEmployees() {
    const token = await getAccessToken();
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/employee/search`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data.data || response.data;
    } catch (error) {
        throw new Error("Failed to fetch employees");
    }
}

// --- M_FR3: The total bonus must be stored in your tenant within OrangeHRM ---
async function saveBonusToOrangeHRM(employeeId, bonusAmount, year) {
    const token = await getAccessToken();
    try {
        const payload = qs.stringify({
            year: year,
            value: bonusAmount,
        });

        const response = await axios.post(`${BASE_URL}/api/v1/employee/${employeeId}/bonussalary`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch bonus salary:", error.response ? error.response.data : error.message);
        throw new Error("Failed to fetch bonus salary");
    }
}

module.exports = { getAllEmployees, saveBonusToOrangeHRM };