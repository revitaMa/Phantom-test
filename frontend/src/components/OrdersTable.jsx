import { useEffect, useState } from "react";
import { getOrders } from "../api/api.js";
import OrderRow from "./OrderRow.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function OrdersTable({ onOpen }) {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const data = await getOrders();
        if (!cancel) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancel) setErr(e.message || "Failed loading orders");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  if (loading) return <LoadingSpinner />;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!rows.length) return <div>No orders found.</div>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Item Name</th>
            <th>Ordered Number</th>
            <th>Date</th>
            <th>Fulfillment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <OrderRow key={o.orderid} order={o} onClick={() => onOpen?.(o)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
