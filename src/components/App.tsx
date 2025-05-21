import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Home.tsx";
import InvitePage from "./InvitePage.tsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">
            📰 Știri Exclusive
          </h1>
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-blue-600 hover:underline font-medium">
                  Autentificare
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>

        <main className="max-w-3xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
