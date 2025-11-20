import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Redirect = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) return;

    const doRedirect = async () => {
      try {
        const res = await axios.get(
          `https://smallurl-vcce.onrender.com/${code}`
        );
       // const targetUrl = res.data?.url;
 const targetUrl = `https://smallurl-vcce.onrender.com/${code}`;
        if (targetUrl) {
          window.location.replace(targetUrl);
        } else {
          setError("Link not found");
        }
      } catch (err) {
        setError("Link not found");
      }
    };

    doRedirect();
  }, [code]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Link not found</h1>
          <p className="mb-4 text-slate-400">
            This short link doesn't exist or may have expired.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
      <div className="text-center text-slate-400">Redirecting…</div>
    </div>
  );
};

export default Redirect;