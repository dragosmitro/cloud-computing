import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { db } from "../firebaseconfig.js";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
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
      if (user?.emailAddresses[0]?.emailAddress) {
        const email = user.emailAddresses[0].emailAddress;
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
      }
    };

    checkAccessAndFetchNews();
  }, [user]);

  return (
    <>
      <SignedOut>
        <p>Te rog autentifică-te pentru a vedea știrile.</p>
      </SignedOut>
      <SignedIn>
        {allowed === false ? (
          <div className="text-red-600 font-bold">
            Nu ai fost invitat. Acces interzis.
          </div>
        ) : allowed === true ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
              Știri Exclusive
            </h2>
            <div className="grid gap-6">
              {news.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{item.content}</p>
                  <p className="text-sm text-gray-400">{item.date}</p>
                </div>
              ))}
            </div>
            <Link
              to="/invite"
              className="inline-block mt-8 text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Invită un prieten
            </Link>
          </>
        ) : (
          <p>Se verifică accesul...</p>
        )}
      </SignedIn>
    </>
  );
}
