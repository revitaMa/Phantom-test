import { useEffect, useState } from "react";
import { getOrderById } from "../api/api.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function OrderModal({ orderId, onClose }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const detail = await getOrderById(orderId);
        if (!cancel) setData(detail);
      } catch (e) {
        if (!cancel) setErr(e.message || "Failed loading order");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [orderId]);

  return (
    <div style={backdrop}>
      <div style={modal}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0 }}>Order {orderId}</h3>
          <button onClick={onClose}>×</button>
        </div>

        {loading && <LoadingSpinner />}
        {err && <div style={{ color: "crimson" }}>{err}</div>}
        {data && (
          <div style={{ display: "grid", gap: 6 }}>
            <KV k="Order ID" v={data.orderid} />
            <KV k="Item Name" v={data.item_name} />
            <KV k="Ordered Number" v={data.ordered_number} />
            <KV k="Price / Unit" v={data.price_per_unit} />
            <KV k="Total Price" v={data.total_price} />
            <KV k="Customer" v={data.customer_name} />
            <KV k="Shipping Address" v={data.shipping_address} />
            <KV k="Date Ordered" v={data.date_ordered} />
            <KV k="Estimated Delivery" v={data.estimated_delivery} />
            <KV k="Fulfillment Status" v={data.fulfillment_status} />
            <KV k="Tracking #" v={data.tracking_number} />
          </div>
        )}
      </div>
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div>
      <strong>{k}:</strong> <span>{String(v ?? "-")}</span>
    </div>
  );
}

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "grid",
  placeItems: "center",
  padding: 16,
};
const modal = {
  background: "white",
  color: "black",
  borderRadius: 12,
  padding: 16,
  width: "min(800px, 96vw)",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};
