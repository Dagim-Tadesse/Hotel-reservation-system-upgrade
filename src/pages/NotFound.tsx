import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md text-center">
        {/* Header with 404 */}
        <div className="mb-8">
          <h1 className="text-7xl font-bold font-serif text-primary mb-4">404</h1>
          <div className="h-1 w-32 bg-primary mx-auto rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-4">Page Not Found</h2>
          <p className="text-base text-muted-foreground mb-3">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          {location.pathname && location.pathname !== "/" && (
            <p className="text-sm text-muted-foreground break-all">
              Requested: <span className="font-mono">{location.pathname}</span>
            </p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link 
            to="/" 
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200"
          >
            Back to Home
          </Link>
          <Link 
            to="/login" 
            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
