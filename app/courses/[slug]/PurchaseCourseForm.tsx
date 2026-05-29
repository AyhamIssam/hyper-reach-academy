"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function PurchaseCourseForm({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) {
  const [customerName, setCustomerName] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submitPurchase() {
    if (!customerName.trim()) {
      setMessage("يرجى إدخال اسم العميل");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let paymentProofUrl: string | null = null;

      if (paymentProof) {
        const fileExt = paymentProof.name.split(".").pop();
        const fileName = `${userId}-${courseId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(fileName, paymentProof);

        if (uploadError) {
          setMessage(uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("payment-proofs")
          .getPublicUrl(fileName);

        paymentProofUrl = data.publicUrl;
      }

      const { error } = await supabase.from("enrollments").upsert(
        {
          user_id: userId,
          course_id: courseId,
          customer_name: customerName,
          payment_proof_url: paymentProofUrl,
          approved: false,
          payment_status: "pending",
        },
        {
          onConflict: "user_id,course_id",
        }
      );

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("تم إرسال طلب الشراء بنجاح. الحالة: بانتظار الموافقة.");
      setPaymentProof(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white">
      <h2 className="mb-4 text-2xl font-bold">شراء الدورة</h2>

      <div className="mb-5 rounded-xl border border-blue-900 bg-blue-950/40 p-4">
        <p className="mb-2 font-semibold">الدفع عن طريق CliQ</p>
        <p className="text-slate-300">CliQ Alias:</p>
        <p className="text-xl font-bold text-blue-400">HyperReach</p>
      </div>

      <div className="space-y-4">
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="اسم العميل"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            صورة إثبات الدفع - اختياري
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
          />
        </div>

        <button
          onClick={submitPurchase}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "جاري إرسال الطلب..." : "إرسال طلب الشراء"}
        </button>

        {message && (
          <p className="rounded-xl bg-slate-900 p-3 text-sm text-slate-200">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}