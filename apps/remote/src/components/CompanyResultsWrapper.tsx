import { useEffect, useRef } from 'react';

interface CompanyResultsWrapperProps {
    results?: any[];
}

export function CompanyResultsWrapper({ results }: CompanyResultsWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // @ts-ignore - web-components doesn't have type declarations
        import('web-components').then(() => {
            console.log('web-components loaded for results');
            if (!containerRef.current) return;

            // Create the custom element
            const resultsElement = document.createElement('company-results');
            elementRef.current = resultsElement;

            // Append to container
            containerRef.current.appendChild(resultsElement);
        });

        return () => {
            if (elementRef.current && containerRef.current?.contains(elementRef.current)) {
                containerRef.current.removeChild(elementRef.current);
            }
        };
    }, []);

    // Update results whenever they change
    useEffect(() => {
        if (elementRef.current && results) {
            (elementRef.current as any).results = results;
        }
    }, [results]);

    return <div ref={containerRef}></div>;
}
