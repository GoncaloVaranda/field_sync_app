const BASE_URL = "https://fieldsync-adc.oa.r.appspot.com/rest"; // ajusta para a tua URL

export default class AuthService {

  /**
   * Tenta iniciar sessão no backend.
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<object>} resposta JSON do servidor
   * @throws lança Error em caso de falha HTTP
   */
  static async login(username, password) {
    const url = `${BASE_URL}/login`;  // endpoint REST de login

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),}
    );

    if (!response.ok) {
      // podes ler o payload de erro do servidor se quiseres
      const errorBody = await response.text();
      throw new Error(`Login falhou (${response.status}): ${errorBody}`);
    }

    // supõe que o backend devolve { token: "...", user: { ... } }
    return response.json();
  }



  static async register(
      username,
      email,
      password,
      name,
      nationality,
      residenceCountry,
      address,
      postalCode,
      phone1,
      phone2,
      confirmation,
      nic,
      nicIssueDate,
      nicIssuePlace,
      nicExpiryDate,
      financialId,
      employer,
      birthDate,
      role,
  ) {
    const url = `${BASE_URL}/register`; // endpoint REST de registo

    // Create the registration payload
    const payload = {
      username,
      email,
      password,
      name,
      nationality: nationality || "",
      residenceCountry: residenceCountry || "",
      address: address || "",
      postalCode: postalCode || "",
      phone1: phone1 || "",
      phone2: phone2 || "",
      confirmation,
      nic: nic || "",
      nicIssueDate: nicIssueDate || "",
      nicIssuePlace: nicIssuePlace || "",
      nicExpiryDate: nicExpiryDate || "",
      financialId: financialId || "",
      employer: employer || "",
      birthDate: birthDate || "",
      role
    };



    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro no servidor (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Falha na requisição:', err);
      throw err;
    }
  }


  static async changeAttributes(
      token,
      password,
      confirmation,
      name,
      phone1,
      phone2,
      nic,
      nicIssueDate,
      nicIssuePlace,
      nicExpiryDate,
      financialId,
      employer,
      address,
      postalCode,
      birthDate,
      nationality,
      residenceCountry


  ){
    const url = `${BASE_URL}/change-attributes`; // endpoint REST de registo

    if (!token) {
      throw new Error('Autenticação necessária. Por favor, faça login novamente.');
    }

    const payload = {
      token,
      password,
      confirmation,
      name,
      phone1: phone1 || "",
      phone2: phone2 || "",
      nic: nic || "",
      nicIssueDate: nicIssueDate || "",
      nicIssuePlace: nicIssuePlace || "",
      nicExpiryDate: nicExpiryDate || "",
      financialId: financialId || "",
      employer: employer || "",
      address: address || "",
      postalCode: postalCode || "",
      birthDate: birthDate || "",
      nationality: nationality || "",
      residenceCountry: residenceCountry || ""
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };



  static async changePassword(token, currentPassword, newPassword, confirmation) {
    const url = `${BASE_URL}/change-password`;

    const payload = {
      token,
      currentPassword,
      newPassword,
      confirmation
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };

  static async logout(token) {
    const url = `${BASE_URL}/logout`;

    const payload = {
      token,
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };

  static async changePrivacy(token, privacy) {
    const url = `${BASE_URL}/change-privacy`;

    const payload = {
      token,
      privacy
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };


  static async changeRole(token, targetUsername, role) {

    const url = `${BASE_URL}/change-role`;

  const payload = {
    token,
    targetUsername,
    role
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
      console.error('Falha na requisição:', err);
      throw err;
    }

  };


  static async changeState(token, targetUsername, state) {
    const url = `${BASE_URL}/change-state/`;

    const payload = {
      token,
      targetUsername,
      state
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };

  static async changeStateToRemovalRequest(token) {
    const url = `${BASE_URL}/change-state/removal-request`;

    const payload = {
      token,
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };


  static async checkAccountState(token, targetUsername) {
    const url = `${BASE_URL}/check-account-state`;

    const payload = {
      token,
      targetUsername,
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };

  static async listUsersPrivateAccounts(token) {

    const url = `${BASE_URL}/list-users/private-accounts`;

    const payload = {
      token,
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };

  static async listUsers(token) {
    const url = `${BASE_URL}/list-users`;

    const payload = {
      token,
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };

  static async listRemoveRequests(token) {
    const url = `${BASE_URL}/list-users/removal-requests`;
    const payload = {
      token,
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };

  static async removeUser(token, targetID) {
    const url = `${BASE_URL}/remove-user`;
    const payload = {
      token,
      targetID
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
      console.error('Falha na requisição:', err);
      throw err;
    }
  };

  static async importWorksheet(token, worksheetData) {
    const url = `${BASE_URL}/worksheets/worksheet-import`;
    const payload = {
      token,
      ...worksheetData
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

}