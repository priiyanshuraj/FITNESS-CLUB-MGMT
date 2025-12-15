import { useEffect, useState } from "react";
import API from "../../lib/api";

const PaymentHistory = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get<{ data: any[] }>("/payments")
      .then((res) => {
        console.log("Payments:", res.data.data);
        setPayments(res.data.data);
      })
      .catch(() => alert("Failed to load payments"));
  }, []);

  const filteredPayments = payments.filter((p) =>
    p.userId?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

      <input
        type="text"
        placeholder="Search by member name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Member</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((p) => (
            <tr key={p._id}>
              <td className="border p-2">{p.userId?.name}</td>
              <td className="border p-2">₹{p.amount}</td>
              <td className="border p-2">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
