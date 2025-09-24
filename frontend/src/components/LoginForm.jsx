import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canSubmit = username.trim().length > 0 && password.trim().length > 0;

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!username.trim() || !password.trim()) {
      setErr("Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password.trim());
    } catch (e) {
      if (e.status === 400) setErr(e.message || "Missing username/password.");
      else if (e.status === 401) setErr(e.message || "Invalid credentials.");
      else setErr(e.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
      <h2>Sign in</h2>

      <label>
        Username
        <input
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setU(e.target.value)}
          autoComplete="username"
        />
      </label>

      <label>
        Password
        <input
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setP(e.target.value)}
          autoComplete="current-password"
        />
      </label>

      <button disabled={loading || !canSubmit}>
        {loading ? "…" : "Login"}
      </button>

      {err && <div style={{ color: "crimson" }}>{err}</div>}
    </form>
  );
}
