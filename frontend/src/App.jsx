import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import LoginForm from "./components/LoginForm.jsx";
import OrdersTable from "./components/OrdersTable.jsx";
import OrderModal from "./components/OrderModal.jsx";

export default function App() {
  const { isAuthenticated, checking, logout } = useAuth();
  const [selected, setSelected] = useState(null);

  if (checking) return <div style={{ padding: 24 }}>Loading…</div>;

  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <LoginForm />
      </div>
    );
  }

  return (
    <div
      style={{ fontFamily: "system-ui", padding: 24, display: "grid", gap: 12 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Orders</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <OrdersTable onOpen={setSelected} />

      {selected && (
        <OrderModal
          orderId={selected.orderid}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
