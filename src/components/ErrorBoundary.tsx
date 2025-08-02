import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error?.toString() };
  }
  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, background: "#ffe6e6", borderRadius: 8 }}>
          <h2 style={{ color: "#D62718" }}>Something went wrong</h2>
          <div>{this.state.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
