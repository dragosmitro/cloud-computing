import { useState } from "react";
import { db } from "../firebaseconfig.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  const handleInvite = async () => {
    if (!email) return;
    setStatus("sending");

    const docRef = doc(db, "users", email);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      await setDoc(docRef, { email });
    }

    setTimeout(() => {
      setStatus("done");
      setTimeout(() => navigate("/"), 1500);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
        Invită un prieten
      </h2>
      <p className="text-sm text-center text-gray-600 mb-6">
        Introdu adresa de email a prietenului tău pentru a-i oferi acces la
        știri.
      </p>

      <input
        type="email"
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Email prieten"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleInvite}
        disabled={status === "sending"}
        className={`w-full py-3 text-white rounded-lg font-medium transition ${
          status === "sending"
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Trimite invitația
      </button>

      {status === "done" && (
        <p className="text-green-600 text-center font-medium mt-4">
          ✅ Invitație trimisă!
        </p>
      )}
    </div>
  );
}
