"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export type Plan = "free" | "pro";

export type SearchUsage = {
  allowed?: boolean;
  plan?: Plan;
  searches_today?: number;
  limit?: number;
};

type PlanContextType = {
  plan: Plan;
  searchesToday: number;
  canSearch: boolean;
  loading: boolean;
  syncUsage: (usage: SearchUsage | null | undefined) => void;
  downgradeToFree: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const FREE_SEARCH_LIMIT = 5;
export const FREE_COMPARE_LIMIT = 2;

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan>("free");
  const [searchesToday, setSearchesToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    async function fetchOrCreateProfile() {
      if (!user) {
        setPlan("free");
        setSearchesToday(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("plan, searches_today, search_date")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        await supabase.from("profiles").insert({ id: user.id });
        setPlan("free");
        setSearchesToday(0);
      } else {
        setPlan(data.plan as Plan);
        setSearchesToday(data.search_date === today ? data.searches_today : 0);
      }
      setLoading(false);
    }

    fetchOrCreateProfile();
  }, [user]);

  // Re-read the profile on demand (e.g. polling after Stripe Checkout grants Pro).
  // Leaves `loading` untouched to avoid UI flicker on a logged-in refetch.
  const refresh = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("profiles")
      .select("plan, searches_today, search_date")
      .eq("id", user.id)
      .single();
    if (data) {
      setPlan(data.plan as Plan);
      setSearchesToday(data.search_date === today ? data.searches_today : 0);
    }
  }, [user]);

  // The counter is owned by the server (consume_search RPC, called from /api/analyze).
  // The client just mirrors the authoritative numbers the API returns.
  const syncUsage = useCallback((usage: SearchUsage | null | undefined) => {
    if (!usage) return;
    if (typeof usage.searches_today === "number") setSearchesToday(usage.searches_today);
    if (usage.plan === "free" || usage.plan === "pro") setPlan(usage.plan);
  }, []);

  // Pro is granted only by the Stripe webhook (see /api/stripe/webhook). The client
  // can self-downgrade to Free; set_plan rejects any other target server-side.
  const downgradeToFree = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { error } = await supabase.rpc("set_plan", { p: "free" });
    if (!error) setPlan("free");
  }, [user]);

  const canSearch = plan === "pro" || searchesToday < FREE_SEARCH_LIMIT;

  return (
    <PlanContext.Provider
      value={{ plan, searchesToday, canSearch, loading, syncUsage, downgradeToFree, refresh }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
