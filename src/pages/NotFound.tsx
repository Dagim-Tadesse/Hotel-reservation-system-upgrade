import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="font-serif text-6xl font-bold text-foreground mb-4">404</h1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <Link to="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:opacity-90">
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
