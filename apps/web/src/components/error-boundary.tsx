"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime exception:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
          <Card className="max-w-md w-full border-danger/30 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
                <AlertTriangle size={24} />
              </div>
              <CardTitle className="text-xl text-text-primary">Application Exception</CardTitle>
              <CardDescription className="text-xs">
                A client runtime error occurred while processing this view.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-surface-2 p-3 font-mono text-xs text-text-secondary overflow-x-auto border border-border-subtle">
                {this.state.error?.message || "Unknown client error"}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="accent" className="w-full" onClick={this.handleReset}>
                <RefreshCw size={14} className="mr-2" />
                Reload Application
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
