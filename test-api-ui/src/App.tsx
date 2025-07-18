import React from "react";
import "./App.css";

export default function App({ initialError = "" }) {
  const [url, setUrl] = React.useState("");
  const [runCount, setRunCount] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(initialError);
  const [success, setSuccess] = React.useState(false);
  const [domain, setDomain] = React.useState("");

  const handleChangeDomain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) {
      setError("Domain cannot be empty.");
      return;
    }
    setDomain(value);
  };

  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) {
      setError("Shop cannot be empty.");
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
    if (parseInt(value, 10) > 50) {
      setError("Run count must be less than or equal to 50.");
      return;
    }
    setRunCount(parseInt(value, 10) || 20);
  };

  const handleTest = async () => {
    if (!url || runCount <= 0) {
      setError("Please enter a valid URL and run count.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://test-api.xn--bnhnt-tsa.vn/api/test-ips",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shop: url, runCount, domain }),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      setSuccess(true);
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

  return (
    <div className="container">
      <h1>API Performance Tester</h1>

      <div className="form-group">
        <label htmlFor="url-input">Shop to Test</label>
        <input
          type="text"
          value={url}
          placeholder="example.myshopify.com"
          id="url-input"
          onChange={handleChangeUrl}
        />
      </div>

      <div className="form-group">
        <label htmlFor="url-input">Domain</label>
        <input
          type="text"
          value={domain}
          placeholder="https://example.com"
          id="url-input"
          onChange={handleChangeDomain}
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
      {success && <p className="success">Testing...</p>}
    </div>
  );
}
