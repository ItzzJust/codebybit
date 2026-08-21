"use client";

import { cn } from "@codebybit/ui/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught:", error, info.componentStack);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={cn(
            "flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center",
            this.props.className
          )}
        >
          <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-foreground text-lg font-semibold">
              Something went wrong
            </h2>
            <p className="text-muted-foreground max-w-md text-sm">
              An unexpected error occurred. Please try again.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
