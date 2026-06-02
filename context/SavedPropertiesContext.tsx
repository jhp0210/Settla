"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface SavedProperty {
  id: string;
  property_id: string;
  address: string;
  city: string;
  state_code: string;
  postal_code: string;
  price: number | null;
  beds: number | null;
  baths: string | null;
  sqft: number | null;
  year_built: number | null;
  photo_url: string | null;
  property_type: string | null;
}

type SavedPropertiesContextType = {
  savedProperties: SavedProperty[];
  isSaved: (property_id: string) => boolean;
  saveProperty: (p: Omit<SavedProperty, "id">) => Promise<void>;
  unsaveProperty: (property_id: string) => Promise<void>;
  loading: boolean;
};

const SavedPropertiesContext = createContext<SavedPropertiesContextType | undefined>(undefined);

export function SavedPropertiesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setSavedProperties([]);
      return;
    }
    const supabase = createClient();
    setLoading(true);
    supabase
      .from("saved_properties")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSavedProperties((data as SavedProperty[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const isSaved = useCallback(
    (property_id: string) => savedProperties.some((p) => p.property_id === property_id),
    [savedProperties]
  );

  const saveProperty = useCallback(
    async (p: Omit<SavedProperty, "id">) => {
      if (!user) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("saved_properties")
        .insert({ ...p, user_id: user.id })
        .select()
        .single();
      if (!error && data) {
        setSavedProperties((prev) => [data as SavedProperty, ...prev]);
      }
    },
    [user]
  );

  const unsaveProperty = useCallback(
    async (property_id: string) => {
      if (!user) return;
      const supabase = createClient();
      await supabase
        .from("saved_properties")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", property_id);
      setSavedProperties((prev) => prev.filter((p) => p.property_id !== property_id));
    },
    [user]
  );

  return (
    <SavedPropertiesContext.Provider
      value={{ savedProperties, isSaved, saveProperty, unsaveProperty, loading }}
    >
      {children}
    </SavedPropertiesContext.Provider>
  );
}

export function useSavedProperties() {
  const ctx = useContext(SavedPropertiesContext);
  if (!ctx) throw new Error("useSavedProperties must be used within SavedPropertiesProvider");
  return ctx;
}
