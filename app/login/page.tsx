"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type MessageType = "success" | "error" | "";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("");

  function showMessage(type: MessageType, text: string) {
    setMessageType(type);
    setMessage(text);
  }

  async function signUp() {
    setMessage("");

    if (!fullName.trim()) {
      showMessage("error", "يرجى إدخال الاسم الكامل");
      return;
    }

    if (!email.trim() || !password.trim()) {
      showMessage("error", "يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        showMessage("error", error.message);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          full_name: fullName,
        });

        if (profileError) {
          showMessage("error", profileError.message);
          return;
        }
      }

      showMessage(
        "success",
        "تم إنشاء الحساب بنجاح. إذا كان تأكيد البريد مفعّلًا، يرجى فتح الإيميل وتأكيد الحساب."
      );

      setMode("login");
    } catch (err) {
      console.log(err);
      showMessage("error", "حدث خطأ غير متوقع، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  async function signIn() {
    setMessage("");

    if (!email.trim() || !password.trim()) {
      showMessage("error", "يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showMessage("error", "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      showMessage("success", "تم تسجيل الدخول بنجاح");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.log(err);
      showMessage("error", "حدث خطأ غير متوقع، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-[#020817] text-white flex items-center justify-center p-6"
      dir="rtl"
    >
      <div className="w-full max-w-md border border-blue-900 rounded-2xl p-8 bg-[#071226] shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Hyper Reach Academy
        </p>

        <div className="flex mb-6 rounded-xl overflow-hidden border border-blue-900">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
            className={`w-1/2 p-3 ${
              mode === "login" ? "bg-blue-600" : "bg-[#020817]"
            }`}
          >
            دخول
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
            className={`w-1/2 p-3 ${
              mode === "signup" ? "bg-blue-600" : "bg-[#020817]"
            }`}
          >
            حساب جديد
          </button>
        </div>

        {message && (
          <div
            className={`mb-5 rounded-xl border p-4 text-sm ${
              messageType === "success"
                ? "border-green-700 bg-green-950 text-green-200"
                : "border-red-700 bg-red-950 text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-5">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#020817] border border-gray-800 rounded-xl p-4 outline-none focus:border-blue-600"
            />
          )}

          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#020817] border border-gray-800 rounded-xl p-4 outline-none focus:border-blue-600"
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#020817] border border-gray-800 rounded-xl p-4 outline-none focus:border-blue-600"
          />

          {mode === "login" ? (
            <button
              onClick={signIn}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl p-4 font-bold"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          ) : (
            <button
              onClick={signUp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl p-4 font-bold"
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}