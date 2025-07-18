import React, { useEffect } from "react";
import "./App.css";

type TestResult = {
  url: string;
  method: string;
  runCount: number;
  averageResponseTime: string;
  averageResponseSize: string;
  mostCommonStatus: string;
  statusDistribution?: unknown;
  sampleResponseData?: unknown;
};

export default function App({ initialResults = [], initialError = "" }) {
  const [url, setUrl] = React.useState("");
  const [runCount, setRunCount] = React.useState(50);
  const [loading, setLoading] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [error, setError] = React.useState(initialError);
  const [results, setResults] = React.useState<TestResult[]>(initialResults);

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) {
      setError("URL cannot be empty.");
      return;
    }
    if (!/^https?:\/\//.test(value)) {
      setError("URL must start with http:// or https://");
      return;
    }
    const valueUrl = new URL(value);
    if (valueUrl.origin === window.location.origin) {
      setError("URL invalid: Cannot test the same origin as the UI.");
      return;
    }
    setUrl(value);
  };

  const handleChangeRunCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (isNaN(parseInt(value, 10))) {
      setError("Run count must be a valid number.");
      return;
    }
    if (parseInt(value, 10) <= 0) {
      setError("Run count must be greater than 0.");
      return;
    }
    if (parseInt(value, 10) > 100) {
      setError("Run count must be less than or equal to 100.");
      return;
    }
    setRunCount(parseInt(value, 10) || 50);
  };

  const handleTest = async () => {
    if (!url || runCount <= 0) {
      setError("Please enter a valid URL and run count.");
      return;
    }
    setLoading(true);
    setError("");
    setLogs([]);
    setResults([]);

    try {
      const response = await fetch(
        "https://test-api.xn--bnhnt-tsa.vn/api/test-apis",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, runCount }),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setResults(data.results);
      setLogs(data.logs);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket("ws://localhost:3003");
      ws.onmessage = (event) => {
        console.log("WebSocket message:", event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === "log") {
            setResults(data?.results || []);
          }
        } catch (e) {
          if (e instanceof Error) {
            console.error("WebSocket parse error:", e);
            setError(`Error: ${e.message}`);
          } else {
            setError("Failed to parse WebSocket message");
          }
        }
      };
      ws.onclose = () => {
        setLoading(false);
        console.log("WebSocket connection closed");
      };
      ws.onerror = (e) => {
        if (e instanceof Error) {
          console.error("WebSocket parse error:", e);
          setError(`Error: ${e.message}`);
        } else {
          setError("Failed to parse WebSocket message");
        }
      };
    } catch (e) {
      if (e instanceof Error) {
        console.error("WebSocket parse error:", e);
        setError(`Error: ${e.message}`);
      } else {
        setError("Failed to parse WebSocket message");
      }
    }
  }, []);
  return (
    <div className="container">
      <h1>API Performance Tester</h1>

      <div className="form-group">
        <label htmlFor="url-input">URL to Test</label>
        <input
          type="text"
          value={url}
          placeholder="https://example.com"
          id="url-input"
          onChange={handleChangeUrl}
        />
      </div>

      <div className="form-group">
        <label htmlFor="run-count-input">Number of Runs</label>
        <input
          type="number"
          value={runCount}
          min="1"
          id="run-count-input"
          onChange={handleChangeRunCount}
        />
      </div>

      <button
        id="test-button"
        className="button"
        onClick={handleTest}
        disabled={loading}
      >
        Start Test
        <span
          id="loading-spinner"
          className={`spinner ${loading && "active"}`}
        ></span>
      </button>

      {error && <p className="error">{error}</p>}

      {logs && (
        <div className="form-group">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Logs</h2>
          <div id="logs" className="logs"></div>
        </div>
      )}

      {results.length > 0 && (
        <div className="form-group">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Test Results
          </h2>
          <div className="results-table">
            <table className="table">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Method</th>
                  <th>Runs</th>
                  <th>Avg Response Time (ms)</th>
                  {/* <th>Avg Response Size</th> */}
                  <th>Most Common Status</th>
                </tr>
              </thead>
              <tbody>
                {results?.length &&
                  results.map((result, index) => (
                    <tr key={index}>
                      <td>
                        <p className="col-url" title={result.url}>
                          {result.url}
                        </p>
                      </td>
                      <td>{result.method}</td>
                      <td>{result.runCount}</td>
                      <td>{result.averageResponseTime}</td>
                      {/* <td>{result.averageResponseSize}</td> */}
                      <td>{result.mostCommonStatus}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="download-links">
            <a id="download-json" href="" download>
              Download JSON
            </a>
            <a id="download-csv" href="" download>
              Download CSV
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
