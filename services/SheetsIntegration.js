const BASE_URL = "https://fieldsync-adc.oa.r.appspot.com/rest"; // ajusta para a tua URL

export default class WorksheetService {

    static async importWorksheet(token, worksheetData) {
        const url = `${BASE_URL}/worksheet/import-worksheet`;

        const processedFeatures = worksheetData.features.map((feature) => {
            return {
                type: feature.type,
                properties: {
                    aigp: feature.properties?.aigp || '',
                    rural_property_id: feature.properties?.rural_property_id || '',
                    polygon_id: feature.properties?.polygon_id || 0,
                    UI_id: feature.properties?.UI_id || 0
                },
                geometry: {
                    type: feature.geometry?.type || '',
                    coordinates: feature.geometry?.coordinates || []
                }
            };
        });

        // Processar metadata para garantir a estrutura correta
        const processedMetadata = worksheetData.metadata ? {
            id: worksheetData.metadata.id || 0,
            starting_date: worksheetData.metadata.starting_date || '',
            finishing_date: worksheetData.metadata.finishing_date || '',
            issue_date: worksheetData.metadata.issue_date || '',
            service_provider_id: worksheetData.metadata.service_provider_id || 0,
            award_date: worksheetData.metadata.award_date || '',
            issuing_user_id: worksheetData.metadata.issuing_user_id || 0,
            aigp: worksheetData.metadata.aigp || [],
            posa_code: worksheetData.metadata.posa_code || '',
            posa_description: worksheetData.metadata.posa_description || '',
            posp_code: worksheetData.metadata.posp_code || '',
            posp_description: worksheetData.metadata.posp_description || '',
            operations: worksheetData.metadata.operations ?
                worksheetData.metadata.operations.map((op) => ({
                    operation_code: op.operation_code || '',
                    operation_description: op.operation_description || '',
                    area_ha: op.area_ha || 0
                })) : []
        } : {
            id: 0,
            aigp: [],
            operations: []
        };

        const payload = {
            token,
            type: worksheetData.type,
            name: worksheetData.name, // Use o nome ou um padrão
            crs: worksheetData.crs,
            features: processedFeatures,
            metadata: processedMetadata,
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

    static async viewGeneralWorksheet(worksheetId, token) {
        const url = `${BASE_URL}/worksheet/view-general-worksheet`;
        const payload = {
            id: worksheetId,
            token: token
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

    static async viewDetailedWorksheet(worksheetId, token) {
        const url = `${BASE_URL}/worksheet/view-detailed-worksheet`;
        const payload = {
            id: worksheetId,
            token: token
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
    }

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

    static async createExecutionWorksheet(token, worksheetId) {
        const url = `${BASE_URL}/execution-sheet/create-execution-sheet`;

        const payload = {
            token,
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
            console.error('Falha na requisição de importação:', err);
            throw err;
        }
    };

    static async assignOperations(token, assignOperationsData){
        const url = `${BASE_URL}/execution-sheet/assign-operations`;

        const processedAssignments = assignOperationsData.assignments.map(assignment => ({
            operationCode: assignment.operationCode || '',
            ruralPropertyId: assignment.ruralPropertyId || '',
            polygonId: assignment.polygonId || 0,
            operatorUsername: assignment.operatorUsername || ''
        }));

        const payload = {
            token,
            id: assignOperationsData.id,
            assignments: processedAssignments
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

    static async startActivity(token, operationId, ruralPropertyId, polygonId, worksheetId, startDate) {
        const url = `${BASE_URL}/execution-sheet/start-activity`;

        const payload = {
            token,
            operationId,
            ruralPropertyId,
            polygonId,
            worksheetId,
            startDate
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
            console.error('Falha na requisição de início de atividade:', err);
            throw err;
        }
    };

    static async endActivity(token, operationId, ruralPropertyId, polygonId, worksheetId, activityId, endDate, finalActivity) {
        const url = `${BASE_URL}/execution-sheet/end-activity`;

        const payload = {
            token,
            operationId,
            ruralPropertyId,
            polygonId,
            worksheetId,
            activityId,
            endDate,
            finalActivity
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
            console.error('Falha na requisição de término de atividade:', err);
            throw err;
        }
    };

    static async viewOperationStatus(token, operationId, ruralPropertyId, polygonId, worksheetId) {
        const url = `${BASE_URL}/execution-sheet/view-operation-status`;

        const payload = {
            token,
            operationId,
            ruralPropertyId,
            polygonId,
            worksheetId
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
            console.error('Falha na requisição de visualização de status:', err);
            throw err;
        }
    };

    static async addActivityInfo(token, operationId, ruralPropertyId, polygonId, worksheetId,activityId, notes, gpsTrack, photos) {
        const url = `${BASE_URL}/execution-sheet/add-activity-info`;

        const payload = {
            token,
            operationId,
            ruralPropertyId,
            polygonId,
            worksheetId,
            activityId,
            notes,
            gpsTrack,
            photos
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
            console.error('Falha ao adicionar informações à atividade:', err);
            throw err;
        }
    };

    static async viewOperationStatusGlobal(token, worksheetId, operationId) {
        const url = `${BASE_URL}/execution-sheet/view-status-op-global-fe`;

        const payload = {
            token,
            worksheetId,
            operationId
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
            console.error('Falha ao obter status global da operação:', err);
            throw err;
        }
    };

    static async editOperation(token , worksheetId, operationId, ruralPropertyId, polygonId, estimatedCompletionDate, estimatedDuration, notes) {
        const url = `${BASE_URL}/execution-sheet/edit-operation`;

        const payload = {
            token,
            worksheetId,
            operationId,
            ruralPropertyId,
            polygonId,
            estimatedCompletionDate,
            estimatedDuration,
            notes
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
            console.error('Falha ao editar a operação:', err);
            throw err;
        }
    };

    static async exportExecutionSheet(token, worksheetId) {
        const url = `${BASE_URL}/execution-sheet/export-execution-sheet`;

        const payload = {
            token,
            worksheetId
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
            console.error('Falha ao exportar a folha de execução:', err);
            throw err;
        }
    };

    // Adicione este método ao seu WorksheetService

    static async scheduleWorksheet(token, worksheetId) {
        const url = `${BASE_URL}/worksheet/scheduling-worksheets`;

        const payload = {
            token,
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
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorText;
                } catch {
                    errorMessage = errorText;
                }
                throw new Error(`Erro no servidor (${response.status}): ${errorMessage}`);
            }

            return await response.json();

        } catch (err) {
            console.error('Falha na requisição de agendamento:', err);
            throw err;
        }
    };
}