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
        // se precisares de token prévio, por exemplo:
        // "Authorization": `Bearer ${token}`
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
      // Required fields
      username,
      password,
      confirmation,
      email,
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
      residenceCountry,
      role
  ) {
    const url = `${BASE_URL}/register`; // endpoint REST de registo

    // Create the registration payload
    const payload = {
      username,
      password,
      confirmation,
      email,
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
      residenceCountry,
      role
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Read error payload from server if available
      const errorBody = await response.text();
      throw new Error(`Registration failed (${response.status}): ${errorBody}`);
    }

    // Assume the backend returns the registered user data
    return response.json();
  }

}