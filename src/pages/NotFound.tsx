import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="font-serif text-7xl font-bold text-foreground mb-2">404</h1>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
        </div>
        
        <h2 className="text-2xl font-semibold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-2">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          {location.pathname !== "/" && `Requested path: ${location.pathname}`}
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link 
            to="/" 
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          <Link 
            to="/login" 
            className="border border-primary text-primary px-6 py-2.5 rounded-md text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
