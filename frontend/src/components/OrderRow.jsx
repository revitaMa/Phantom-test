export default function OrderRow({ order, onClick }) {
  return (
    <tr
      onClick={onClick}
      style={{ cursor: "pointer" }}
      title="Click for details"
    >
      <td>{order.orderid}</td>
      <td>{order.item_name}</td>
      <td>{order.ordered_number}</td>
      <td>{order.date}</td>
      <td>{order.fulfillment}</td>
    </tr>
  );
}
