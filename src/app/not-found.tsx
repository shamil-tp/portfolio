import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="font-mono text-5xl font-extrabold text-[var(--accent)]">
        404
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Page Not Found
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          The requested page or route could not be found. Check the URL or return to the home page.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Homepage</span>
      </Link>
    </div>
  );
}
