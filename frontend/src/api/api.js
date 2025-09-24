// formatting error msg
async function parseError(r) {
  let message = `HTTP ${r.status}`;
  try {
    const j = await r.json();
    if (typeof j.error === "string" && j.error.trim()) message = j.error;
  } catch (e) {
    console.debug(e.message);
  }
  const err = new Error(message);
  err.status = r.status;
  return err;
}

export async function login(username, password) {
  const r = await fetch("/api/dev_test/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) throw await parseError(r);
  return r.json();
}

export async function logout() {
  const r = await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!r.ok) throw await parseError(r);
  return r.json();
}

export async function getMe() {
  const r = await fetch("/api/me", { credentials: "include" }); //credentials not must with proxy
  if (!r.ok) throw await parseError(r);
  return r.json();
}

export async function getOrders() {
  const r = await fetch("/api/orders", { credentials: "include" });
  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try {
      const j = await r.json();
      if (j.error) msg = j.error;
    } catch (e) {
      console.debug(e.message);
    }
    throw new Error(msg);
  }
  return r.json();
}

export async function getOrderById(orderId) {
  console.log("orderID: ", orderId);
  const r = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
    credentials: "include",
  });
  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try {
      const j = await r.json();
      if (j.error) msg = j.error;
    } catch (e) {
      console.debug(e.message);
    }
    throw new Error(msg);
  }
  return r.json();
}
