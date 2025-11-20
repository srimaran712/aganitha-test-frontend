import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Copy, Calendar, MousePointerClick } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";


const formatRelativeTime = (date) => {
  if (!date) return "Never";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const formatDateTime = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};

const Stats = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!code) return;

      setLoading(true);
      setError(null);
      try {
        const data = await axios.get(`https://smallurl-vcce.onrender.com/api/links/${code}`);
        setStats(data.data.link);
      } catch (err) {
        if (err.status === 404) {
          setError("Link not found");
        } else {
          setError(err.message || "Failed to load stats");
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [code]);

  const copyShortUrl = () => {
    if (!code) return;
    const url = `https://smallurl-vcce.onrender.com/${code}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-slate-400">Loading stats...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{error || "Not Found"}</h1>
          <p className="text-slate-400 mb-6">
            This short link doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold font-mono">{stats.code}</h1>
            <Button onClick={copyShortUrl} variant="outline">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
          <a
            href={stats.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-slate-50 inline-flex items-center gap-2"
          >
            {stats.url}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5" />
                Total Clicks
              </CardTitle>
              <CardDescription>Number of times this link was accessed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalClicks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Last Clicked
              </CardTitle>
              <CardDescription>Most recent access time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">
                {stats.lastClickedAt
                  ? formatRelativeTime(stats.lastClickedAt)
                  : "Never"}
              </div>
              {stats.lastClickedAt && (
                <div className="text-sm text-slate-400 mt-2">
                  {formatDateTime(stats.lastClickedAt)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Created</CardTitle>
              <CardDescription>When this link was created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium">
                {formatRelativeTime(stats.createdAt)}
              </div>
              <div className="text-sm text-slate-400 mt-2">
                {formatDateTime(stats.createdAt)}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Stats;