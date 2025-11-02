import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" lang="ar" className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">حدث خطأ</h1>
            <p className="text-gray-600 mb-6">
              عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
            </p>
            {this.state.error && (
              <details className="mb-6 text-right bg-gray-100 p-4 rounded-lg text-sm">
                <summary className="cursor-pointer font-semibold mb-2">تفاصيل الخطأ</summary>
                <pre className="whitespace-pre-wrap text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                إعادة التحميل
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

