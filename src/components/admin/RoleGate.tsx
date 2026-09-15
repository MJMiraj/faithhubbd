import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

type RoleGateProps = {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
};

export async function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const session = await getServerSession(authOptions);
  
  // @ts-ignore - role is injected via callbacks in auth.ts
  const userRole = session?.user?.role as string | undefined;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
