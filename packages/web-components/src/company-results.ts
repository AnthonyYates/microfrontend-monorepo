export class CompanyResults extends HTMLElement {
  private shadow: ShadowRoot;
  private _results: any = [];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    console.log('company-results: connectedCallback');
    this.render();
  }

  // Property to set results
  set results(data: any[]) {
    this._results = data;
    this.render();
  }

  get results() {
    return this._results;
  }

  private render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          text-align: left;
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .no-results {
          padding: 10px;
          color: #666;
          font-style: italic;
        }
      </style>
      <div id="container">
        ${this.renderContent()}
      </div>
    `;
  }

  private renderContent() {
    // Handle OData-style response { value: [...] }
    console.log('company-results: renderContent');
    let data = this._results;
    if (data && data.value && Array.isArray(data.value)) {
      data = data.value;
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return '<div class="no-results">No results to display</div>';
    }

    let items = Array.isArray(data) ? data : [data];

    // Filter out nulls if any
    items = items.filter(i => i);

    if (items.length === 0) {
      return '<div class="no-results">No results found</div>';
    }

    const rows = items.map(item => `
      <tr>
        <td>${item.name || ''}</td>
        <td>${item.department || ''}</td>
        <td>${item.orgNr || ''}</td>
        <td>${item.number || ''}</td>
      </tr>
    `).join('');

    return `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Org Nr</th>
            <th>Number</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }
}
