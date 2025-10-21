"use client";

import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminAuthWrapper from "@/components/auth/AdminAuthWrapper";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
