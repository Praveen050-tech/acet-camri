import React from 'react';
import { Box, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ACET CAMRI Application Crash:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6 text-center">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#eef9f3] text-[#00714C] flex items-center justify-center mx-auto">
              <Box size={28} />
            </div>
            <h2 className="font-['Cinzel'] text-2xl font-bold text-gray-900">Application Error</h2>
            <p className="text-xs text-gray-600">
              An unexpected error occurred. Please try again or refresh the page.
            </p>
            {this.state.error && (
              <details className="text-left bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] text-gray-500 max-h-32 overflow-auto">
                <summary className="cursor-pointer font-bold text-gray-700 text-xs mb-1">Error Details</summary>
                <pre className="whitespace-pre-wrap break-all">{this.state.error.toString()}</pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs px-5 py-3 rounded-xl shadow-sm inline-flex items-center gap-2 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#00714C] hover:bg-[#005a3c] text-white font-bold text-xs px-6 py-3 rounded-xl shadow inline-flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
