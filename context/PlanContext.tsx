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

type PlanContextType = {
  plan: Plan;
  searchesToday: number;
  canSearch: boolean;
  loading: boolean;
  incrementSearch: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  downgradeToFree: () => Promise<void>;
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

  const incrementSearch = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    const newCount = searchesToday + 1;

    await supabase
      .from("profiles")
      .update({ searches_today: newCount, search_date: today, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    setSearchesToday(newCount);
  }, [user, searchesToday]);

  const upgradeToPro = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ plan: "pro", updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setPlan("pro");
  }, [user]);

  const downgradeToFree = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ plan: "free", updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setPlan("free");
  }, [user]);

  const canSearch = plan === "pro" || searchesToday < FREE_SEARCH_LIMIT;

  return (
    <PlanContext.Provider
      value={{ plan, searchesToday, canSearch, loading, incrementSearch, upgradeToPro, downgradeToFree }}
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
