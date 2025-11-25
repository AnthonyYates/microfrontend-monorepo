import { useEffect, useRef } from 'react';

interface CompanySearchWrapperProps {
    apiUrl: string;
    token: string;
    onResults?: (results: any) => void;
}

export function CompanySearchWrapper({ apiUrl, token, onResults }: CompanySearchWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let searchElement: HTMLElement | null = null;
        let handleResults: ((e: any) => void) | null = null;

        // Explicitly import web-components to register custom elements
        // Using dynamic import to prevent tree-shaking
        // @ts-ignore - web-components doesn't have type declarations
        import('web-components').then(() => {
            console.log('web-components loaded');
            if (!containerRef.current) return;

            // Create the custom element
            searchElement = document.createElement('company-search');

            // Set attributes
            searchElement.setAttribute('api-url', apiUrl);
            searchElement.setAttribute('token', token);

            // Add event listener
            handleResults = (e: any) => {
                if (onResults) {
                    onResults(e.detail.results);
                }
            };

            searchElement.addEventListener('company-results', handleResults);

            // Append to container
            containerRef.current.appendChild(searchElement);
        });

        // Cleanup function
        return () => {
            if (searchElement && handleResults) {
                searchElement.removeEventListener('company-results', handleResults);
            }
            if (containerRef.current && searchElement && containerRef.current.contains(searchElement)) {
                containerRef.current.removeChild(searchElement);
            }
        };
    }, [apiUrl, token, onResults]);

    return <div ref={containerRef}></div>;
}
