"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            AI Housing
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
          >
            로그아웃
          </button>
        </div>

        {/* Welcome */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {user?.user_metadata?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.user_metadata.avatar_url}
                alt="프로필 이미지"
                className="h-12 w-12 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                안녕하세요,{" "}
                {user?.user_metadata?.full_name ?? user?.email ?? "사용자"}님!
              </h1>
              <p className="mt-1 text-sm text-white/50">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
