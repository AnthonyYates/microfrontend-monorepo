import { CompanySearch } from './company-search';
import { CompanyResults } from './company-results';

// Register Custom Elements
if (!customElements.get('company-search')) {
    customElements.define('company-search', CompanySearch);
}

if (!customElements.get('company-results')) {
    customElements.define('company-results', CompanyResults);
}

export { CompanySearch, CompanyResults };
