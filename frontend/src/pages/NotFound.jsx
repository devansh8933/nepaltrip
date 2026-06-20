import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section data-testid="not-found-page" className="min-h-[70vh] grid place-items-center container-pad">
      <div className="text-center">
        <p className="overline text-[#DC143C] mb-4">404</p>
        <h1 className="font-display text-5xl sm:text-7xl text-[#1C3144] mb-6">Page not found</h1>
        <p className="text-[#4A4A4A] mb-8">The page you were looking for is not here.</p>
        <Link to="/" data-testid="not-found-home" className="inline-flex items-center px-8 py-4 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#DC143C] transition-colors">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
