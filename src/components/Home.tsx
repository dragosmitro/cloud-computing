import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { db } from "../firebaseconfig.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export type NewsItem = {
  title: string;
  content: string;
  date: string;
};

export default function Home() {
  const { user } = useUser();
  const [news, setNews] = useState([]);
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkAccessAndFetchNews = async () => {
      const email = user?.emailAddresses[0]?.emailAddress;
      if (!email) return;

      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setAllowed(false);
        return;
      }

      setAllowed(true);
      const snapshot = await getDocs(collection(db, "news"));
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          date: data.date.toDate().toLocaleDateString("ro-RO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        };
      });
      setNews(items);
    };

    checkAccessAndFetchNews();
  }, [user]);

  return (
    <>
      <SignedOut>
        <p className="text-center text-gray-600">
          Te rog autentifică-te pentru a vedea știrile.
        </p>
      </SignedOut>

      <SignedIn>
        {allowed === false ? (
          <div className="text-red-600 font-semibold text-center">
            Nu ai fost invitat. Accesul este restricționat. Roagă un user deja
            existent să te invite!
          </div>
        ) : allowed === true ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
              Știri Exclusive
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {news.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{item.content}</p>
                  <p className="text-sm text-gray-400">{item.date}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/invite"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Invită un prieten
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Se verifică accesul...</p>
        )}
      </SignedIn>
    </>
  );
}
