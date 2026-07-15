"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BackofficePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/backoffice/dashboard");
  }, []);
  return null;
}
