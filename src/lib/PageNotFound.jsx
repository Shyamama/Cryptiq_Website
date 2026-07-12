import { Link, useLocation } from 'react-router-dom';

export default function PageNotFound() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#080808] text-[#E2E2E2]">
            <div className="max-w-md w-full text-center">
                <p className="font-mono text-[11px] tracking-widest text-foreground/50 mb-6">
                    ERR // 404
                </p>
                <h1 className="font-mono text-2xl md:text-3xl font-light tracking-tight mb-4">
                    Path not found.
                </h1>
                <p className="font-body text-base text-foreground/60 leading-relaxed mb-10">
                    <span className="font-mono text-foreground/80">{location.pathname}</span>{" "}
                    doesn't resolve to anything here.
                </p>
                <Link
                    to="/"
                    className="inline-block font-mono text-xs tracking-widest text-foreground/80 hover:text-foreground border border-white/20 hover:border-white/30 px-6 py-3 transition-colors"
                >
                    ← RETURN HOME
                </Link>
            </div>
        </div>
    );
}
