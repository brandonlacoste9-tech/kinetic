import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-on-surface flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-surface p-12 rounded-[2rem] border-4 border-primary shadow-2xl">
            <h1 className="font-headline text-4xl font-black italic text-primary uppercase mb-6">SYSTEM_CRASH</h1>
            <div className="bg-black/5 p-6 rounded-xl font-mono text-xs text-secondary mb-8 overflow-auto max-h-64">
              {this.state.error?.toString()}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="kinetic-gradient text-on-primary font-headline font-black px-8 py-4 rounded-xl uppercase tracking-widest hover:scale-105 transition-transform"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
