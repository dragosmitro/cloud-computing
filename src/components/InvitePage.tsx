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
    <div className="max-w-md mx-auto bg-white border rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
        Invită un prieten
      </h2>
      <input
        type="email"
        className="w-full border rounded-lg p-3 mb-3 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Email prieten"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleInvite}
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors ${
          status === "sending"
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
        disabled={status === "sending"}
      >
        Trimite invitația
      </button>
      {status === "done" && (
        <p className="mt-3 text-green-600 text-center font-medium">
          Invitație trimisă!
        </p>
      )}
    </div>
  );
}
