import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useSupabase } from "./useSupabase";

export function useSavedProperty(propertyID: string) {
  const { userId } = useAuth();
  const authSupabase = useSupabase();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  useEffect(() => {
    checkIfSaved();
  }, [propertyID, userId]);

  async function checkIfSaved() {
    if (!userId) return;

    const { data } = await authSupabase
      .from("saved_properties")
      .select("*")
      .eq("user_clerk_id", userId)
      .eq("property_id", propertyID)
      .single();

    setIsSaved(!!data);
  }

  async function toggleSave() {
    if (!userId) return;
    setSaveLoading(true);
    if (isSaved) {
      const { error } = await authSupabase
        .from("saved_properties")
        .delete()
        .eq("user_clerk_id", userId)
        .eq("property_id", propertyID);
      setIsSaved(false);
    } else {
      await authSupabase
        .from("saved_properties")
        .insert({ user_clerk_id: userId, property_id: propertyID });
      setIsSaved(true);
    }
    setSaveLoading(false);
  }

  return { isSaved, saveLoading, toggleSave };
}
