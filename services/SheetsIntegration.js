const BASE_URL = "https://fieldsync-adc.oa.r.appspot.com/rest"; // ajusta para a tua URL

export default class WorksheetService {
    
    static async importWorksheet(token, worksheetData) {
        const url = `${BASE_URL}/worksheets/worksheet-import`;
        const payload = {
            worksheetData
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro no servidor (${response.status}): ${errorText}`);
            }

            return await response.json();

        } catch (err) {
            console.error('Falha na requisição de importação:', err);
            throw err;
        }
    };

    static async viewGeneralWorksheet(token, worksheetId) {
        const url = `${BASE_URL}/worksheet/view-general-worksheet`;
        const payload = {
            token: token,
            id: worksheetId
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro no servidor (${response.status}): ${errorText}`);
            }

            return await response.json();

        } catch (err) {
            console.error('Falha na requisição de visualização geral:', err);
            throw err;
        }
    };

    static async removeWorksheet(token, worksheetId) {
        const url = `${BASE_URL}/worksheet/remove-worksheet`;
        const payload = {
            id: worksheetId,
            token: token,  
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro no servidor (${response.status}): ${errorText}`);
            }

            return await response.json();

        } catch (err) {
            console.error('Falha na requisição de remoção:', err);
            throw err;
        }
    };
}