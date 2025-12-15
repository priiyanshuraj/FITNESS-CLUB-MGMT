import { useEffect, useState } from "react";
import API from "../../lib/api";

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  data: T;
}


const AddPayment = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    API.get<{ data: Member[] }>("/users")
      .then((res) => {
        console.log("Users from API:", res.data.data); // DEBUG
        setMembers(res.data.data);
      })
      .catch((err) => {
        console.error("API ERROR:", err);
        alert("Failed to load members");
      });
  }, []);



  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handlePayment = async () => {
    if (!memberId || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/payments", {
        userId: memberId,          // ✅ backend expects userId
        amount: Number(amount),    // ✅ convert string → number
      });

      alert("Payment Successful");
      setAmount("");
      setMemberId("");
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Add Payment</h2>

      <input
        type="text"
        placeholder="Search member by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <select
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">Select Member</option>
        {filteredMembers.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name} ({m.email})
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handlePayment}
        className="bg-purple-700 text-white px-4 py-2 rounded"
      >
        Submit Payment
      </button>
    </div>
  );
};

export default AddPayment;
