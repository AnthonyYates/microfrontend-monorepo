import { useEffect, useState } from 'react';
import { useAuth } from 'auth';

interface ContactEntity {
    ContactId: number;
    Name: string;
    Department: string;
    OrgNr: string;
    Number1: string;
}

export const CompanyInfo = () => {
    const { user, token, isAuthenticated } = useAuth();
    const [contact, setContact] = useState<ContactEntity | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated && token && user?.superOffice?.webApiUrl) {
            setLoading(true);
            // Ensure the URL ends with a slash before appending the endpoint
            const baseUrl = user.superOffice.webApiUrl.endsWith('/')
                ? user.superOffice.webApiUrl
                : `${user.superOffice.webApiUrl}/`;

            fetch(`${baseUrl}v1/Agents/Contact/GetMyContact`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch contact info');
                    return res.json();
                })
                .then(data => {
                    setContact(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [isAuthenticated, token, user?.superOffice?.webApiUrl]);

    if (!isAuthenticated) return null;
    if (loading) return <div>Loading Company Info...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
    if (!contact) return null;

    return (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3>Company Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px' }}>
                <strong>Name:</strong> <span>{contact.Name}</span>
                <strong>Department:</strong> <span>{contact.Department}</span>
                <strong>Org Nr:</strong> <span>{contact.OrgNr}</span>
                <strong>Number 1:</strong> <span>{contact.Number1}</span>
            </div>
        </div>
    );
};
