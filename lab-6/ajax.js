/**
 * Klasa pomocnicza do obsługi zapytań HTTP (Ajax)
 * z wykorzystaniem fetch(). Upraszcza obsługę JSON,
 * błędów, timeoutu i globalnej konfiguracji.
 */
class Ajax {
    /**
     * Domyślne ustawienia dla wszystkich zapytań.
     * @type {object}
     */
    static DEFAULT_OPTIONS = {
        baseURL: '',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        timeout: 5000, // Domyślny timeout 5 sekund
    };

    /**
     * @param {object} [options] Globalne opcje dla instancji.
     * @param {string} [options.baseURL=''] Bazowy URL dla zapytań.
     * @param {object} [options.headers={}] Domyślne nagłówki.
     * @param {number} [options.timeout=5000] Domyślny timeout w ms.
     */
    constructor(options = {}) {
        this.globalOptions = {
            ...Ajax.DEFAULT_OPTIONS,
            ...options,
            headers: {
                ...Ajax.DEFAULT_OPTIONS.headers,
                ...(options.headers || {}),
            },
        };
    }

    /**
     * Główna, prywatna metoda do wykonywania zapytań fetch.
     * @param {string} url Pełny lub względny URL.
     * @param {object} fetchOptions Opcje przekazywane do fetch().
     * @param {number} timeout Czas oczekiwania w ms.
     * @returns {Promise<object>} Dane JSON.
     * @private
     */
    async _request(url, fetchOptions = {}, timeout) {
        const fullUrl = this.globalOptions.baseURL + url;
        const controller = new AbortController();
        const signal = controller.signal;
        
        // Użyj timeoutu z opcji metody, a potem z globalnych
        const actualTimeout = timeout !== undefined ? timeout : this.globalOptions.timeout;
        
        let timeoutId;
        if (actualTimeout > 0) {
            timeoutId = setTimeout(() => {
                controller.abort();
            }, actualTimeout);
        }

        try {
            const response = await fetch(fullUrl, { ...fetchOptions, signal });

            // Anuluj timeout po otrzymaniu odpowiedzi
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // 2. Automatyczna obsługa błędów HTTP (!res.ok)
            if (!response.ok) {
                let errorDetails = response.statusText;
                try {
                    // Próbuj pobrać szczegóły błędu z ciała odpowiedzi, jeśli JSON
                    const errorBody = await response.json();
                    errorDetails = errorBody;
                } catch (e) {
                    // Ignore: ciało nie jest JSON, użyj statusText
                }
                
                // Rzuć wyjątek z odpowiednim komunikatem
                const errorMessage = `HTTP Error ${response.status}: ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`;
                throw new Error(errorMessage);
            }

            // Sprawdź, czy odpowiedź ma ciało i jest JSON (na podstawie nagłówka Content-Type)
            const contentType = response.headers.get("content-type");
            if (response.status !== 204 && contentType && contentType.includes('application/json')) {
                // 3. Zwraca od razu dane w formacie JSON
                return await response.json();
            }

            // Dla np. 204 No Content, zwróć pusty obiekt lub null
            return {}; 

        } catch (error) {
            // Anuluj timeout na wypadek błędu sieci/innego, jeśli jeszcze działa
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // 1. Automatyczna obsługa błędów sieci (np. AbortError z timeoutu)
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${actualTimeout}ms: ${fullUrl}`);
            }

            // Rzuć dalej błąd sieciowy/inny, który wystąpił przed lub w trakcie fetch
            throw new Error(`Network or Fetch Error: ${error.message}`);
        }
    }

    /**
     * Wykonuje zapytanie GET.
     * @param {string} url URL zasobu.
     * @param {object} [options] Opcje specyficzne dla zapytania (nadpisują globalne).
     * @returns {Promise<object>} Dane JSON.
     */
    async get(url, options = {}) {
        const finalOptions = { ...this.globalOptions, ...options };
        
        return this._request(url, {
            method: 'GET',
            headers: { ...finalOptions.headers, ...(options.headers || {}) },
        }, finalOptions.timeout);
    }

    /**
     * Wykonuje zapytanie POST.
     * @param {string} url URL zasobu.
     * @param {object} data Dane do wysłania (JS Object).
     * @param {object} [options] Opcje specyficzne dla zapytania.
     * @returns {Promise<object>} Dane JSON.
     */
    async post(url, data, options = {}) {
        const finalOptions = { ...this.globalOptions, ...options };

        return this._request(url, {
            method: 'POST',
            headers: { ...finalOptions.headers, ...(options.headers || {}) },
            // Automatyczne kodowanie do JSON
            body: JSON.stringify(data), 
        }, finalOptions.timeout);
    }

    /**
     * Wykonuje zapytanie PUT.
     * @param {string} url URL zasobu.
     * @param {object} data Dane do wysłania (JS Object).
     * @param {object} [options] Opcje specyficzne dla zapytania.
     * @returns {Promise<object>} Dane JSON.
     */
    async put(url, data, options = {}) {
        const finalOptions = { ...this.globalOptions, ...options };

        return this._request(url, {
            method: 'PUT',
            headers: { ...finalOptions.headers, ...(options.headers || {}) },
            // Automatyczne kodowanie do JSON
            body: JSON.stringify(data), 
        }, finalOptions.timeout);
    }

    /**
     * Wykonuje zapytanie DELETE.
     * @param {string} url URL zasobu.
     * @param {object} [options] Opcje specyficzne dla zapytania.
     * @returns {Promise<object>} Dane JSON (lub pusty obiekt).
     */
    async delete(url, options = {}) {
        const finalOptions = { ...this.globalOptions, ...options };

        return this._request(url, {
            method: 'DELETE',
            headers: { ...finalOptions.headers, ...(options.headers || {}) },
        }, finalOptions.timeout);
    }
}