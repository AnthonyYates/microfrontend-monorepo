export class CompanySearch extends HTMLElement {
    private shadow: ShadowRoot;
    private apiUrl: string = '';
    private token: string = '';

    static get observedAttributes() {
        return ['api-url', 'token'];
    }

    constructor() {
        super();
        console.log('CompanySearch: constructor');
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        console.log('CompanySearch: connectedCallback');
        this.render();
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        console.log(`CompanySearch: attributeChanged ${name}`, newValue);
        if (name === 'api-url') {
            this.apiUrl = newValue;
        } else if (name === 'token') {
            this.token = newValue;
        }
    }

    private render() {
        console.log('CompanySearch: render');
        this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
          margin-bottom: 20px;
        }
        .search-container {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          flex-grow: 1;
        }
        button {
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        .error {
          color: red;
          margin-top: 5px;
          font-size: 0.9em;
        }
      </style>
      <div class="search-container">
        <input type="text" id="searchInput" placeholder="Enter company name..." />
        <button id="searchBtn">Search</button>
      </div>
      <div id="errorMsg" class="error"></div>
    `;

        const btn = this.shadow.getElementById('searchBtn');
        const input = this.shadow.getElementById('searchInput') as HTMLInputElement;

        btn?.addEventListener('click', () => {
            this.performSearch(input.value);
        });

        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(input.value);
            }
        });
    }

    private async performSearch(query: string) {
        const errorEl = this.shadow.getElementById('errorMsg');
        if (errorEl) errorEl.textContent = '';

        if (!query) return;
        if (!this.apiUrl || !this.token) {
            if (errorEl) errorEl.textContent = 'Configuration Error: Missing API URL or Token';
            return;
        }

        try {
            // Ensure slash at end
            const baseUrl = this.apiUrl.endsWith('/') ? this.apiUrl : `${this.apiUrl}/`;

            const searchUrl = `${baseUrl}v1/contact?$select=name,department,orgnr,number&$filter=name begins '${query}'`;
            console.log('CompanySearch: Sending request to:', searchUrl);
            console.log('CompanySearch: Token:', this.token ? `${this.token.substring(0, 20)}...` : 'NO TOKEN');
            console.log('CompanySearch: Query:', query);

            const response = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Search failed: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('CompanySearch: Search successful', data);

            // Dispatch event with results
            this.dispatchEvent(new CustomEvent('company-results', {
                detail: { results: data },
                bubbles: true,
                composed: true
            }));

        } catch (err: any) {
            console.error(err);
            if (errorEl) errorEl.textContent = err.message;
        }
    }
}
