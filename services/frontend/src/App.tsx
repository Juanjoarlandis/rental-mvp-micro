// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import ErrorBoundary from "./ErrorBoundary";
import { AuthProvider } from "./hooks/useAuth";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Protected from "./Protected";

import "./styles/global.css";

/* ─── Stripe ─────────────────────────────────────────────────────────── */
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PK as string /* pk_test_xxx */
);
/* ─────────────────────────────────────────────────────────────────────── */

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <BrowserRouter>
            <ErrorBoundary>
              <Header />

              <Suspense
                fallback={
                  <p className="py-32 text-center text-gray-500">Cargando…</p>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* ---------- RUTA PROTEGIDA ---------- */}
                  <Route
                    path="/dashboard"
                    element={
                      <Protected>
                        <Dashboard />
                      </Protected>
                    }
                  />
                </Routes>
              </Suspense>

              <Footer />
            </ErrorBoundary>
          </BrowserRouter>
        </Elements>
      </AuthProvider>
    </QueryClientProvider>
  );
}
