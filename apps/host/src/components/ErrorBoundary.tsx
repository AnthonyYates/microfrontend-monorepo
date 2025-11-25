import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false
    };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{ padding: '20px', border: '2px solid red', borderRadius: '4px', margin: '10px 0' }}>
                    <h3 style={{ color: 'red' }}>Something went wrong</h3>
                    <p>{this.state.error?.message || 'Unknown error'}</p>
                </div>
            );
        }

        return this.props.children;
    }
}
