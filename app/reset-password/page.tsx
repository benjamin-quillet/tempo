"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ResetPasswordInner from "./reset-password-inner";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-[100svh] flex items-center justify-center text-white">
      Vérification du lien…
    </div>
  );
}
