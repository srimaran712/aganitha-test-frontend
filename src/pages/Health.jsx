import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockApi } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Server, Clock } from "lucide-react";
import axios from "axios";

const Health = () => {
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setLoading(true);
      try {
        const data = await axios.get("https://smallurl-vcce.onrender.com/healthz");
        setHealth(data.data);
      } catch (error) {
        console.error("Failed to check health:", error);
        setHealth({ ok: false, version: "unknown", uptime: 0 });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

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
          <h1 className="text-4xl font-bold mb-2">System Health</h1>
          <p className="text-slate-400">Monitor system status and uptime</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-slate-400">Checking health...</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-5 w-5 ${health?.message?.ok ? "text-green-500" : "text-red-500"}`}
                  />
                  Status
                </CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold ${
                    health?.message ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {health?.message ? "Healthy" : "Unhealthy"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Version
                </CardTitle>
                <CardDescription>Current application version</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{health?.version || "N/A"}</div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Uptime
                </CardTitle>
                <CardDescription>Time since system started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {health ? formatUptime(health.process_id) : "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Health Check Response</CardTitle>
                <CardDescription>Raw JSON response from /healthz endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto text-slate-100">
                  <code>{JSON.stringify(health, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Health;