import { useState, useEffect } from "react";

import { LinksTable } from "@/components/LinksTable";
import { AddLinkDialog } from "@/components/AddLinkDialog";
import { Link as LinkIcon } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await axios.get("https://smallurl-vcce.onrender.com/api/links");
      setLinks(data.data.generatedLinks);
      console.log(data);
    } catch (err) {
      setError(err.message || "Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-6 w-6" />
              <h1 className="text-2xl font-bold">TinyLink</h1>
            </div>
            <nav className="flex items-center gap-4">
              <a href="/healthz" className="text-sm text-muted-foreground hover:text-foreground">
                Health
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your short links and view statistics
            </p>
          </div>
          <AddLinkDialog onLinkAdded={loadLinks} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-muted-foreground">Loading links...</div>
          </div>
        ) : error ? (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
        ) : (
          <LinksTable links={links} onLinksChange={loadLinks} />
        )}
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          TinyLink - URL Shortener
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;