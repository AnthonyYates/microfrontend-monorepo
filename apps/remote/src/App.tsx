import { useState, useEffect } from 'react'
import { Button } from 'ui'
import { useAuth } from 'auth'
import { CompanyInfo } from './components/CompanyInfo'
import { CompanyResultsWrapper } from './components/CompanyResultsWrapper'

function App() {
    const [count, setCount] = useState(0)
    const { user, isAuthenticated } = useAuth()
    const [searchResults, setSearchResults] = useState<any[]>([]);

    // Listen for search results from the Host app
    useEffect(() => {
        const handleResults = (event: any) => {
            console.log('Remote app received search results:', event.detail.results);
            console.log('Results data structure:', JSON.stringify(event.detail.results, null, 2));
            setSearchResults(event.detail.results);
        };

        window.addEventListener('company-search-results', handleResults);

        return () => {
            window.removeEventListener('company-search-results', handleResults);
        };
    }, []);

    return (
        <div style={{ border: '2px dashed red', padding: '20px', margin: '10px' }}>
            <h2>Remote Application</h2>
            <p>This is the remote application running.</p>

            <div style={{ marginBottom: '10px', padding: '5px', backgroundColor: '#f0f0f0' }}>
                <strong>Remote Auth State:</strong> {isAuthenticated ? `Logged in as ${user?.name}` : 'Not Logged In'}
            </div>

            <CompanyInfo />

            <div style={{ marginTop: '20px' }}>
                <h3>Company Results (Web Component)</h3>
                <CompanyResultsWrapper results={searchResults} />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
                <span>Count: {count}</span>
                <Button onClick={() => setCount((count) => count + 1)}>
                    Increment Remote
                </Button>
            </div>
        </div>
    )
}

export default App
