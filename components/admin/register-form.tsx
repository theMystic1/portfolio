"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import Button from "@/components/btn";

// Shared Auth Layout Component
function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex items-center justify-center bg-surface p-4">
      <div className="bg-elevated shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
}

// SIGNUP PAGE
export function SignupPage() {
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.ok) setError(data.message);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-lg"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button variant="amber" className="w-full">
          Register
        </Button>

        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <Link href="/admin-login" className="font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// LOGIN PAGE
export function SigninPage() {
  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.ok) setError(data.message);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-lg"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button variant="aurora" className="w-full">
          Login
        </Button>

        <p className="text-center text-sm mt-3">
          Don't have an account?{" "}
          <Link href="/admin-register" className="font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

//
