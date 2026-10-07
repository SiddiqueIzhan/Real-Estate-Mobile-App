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
      .maybeSingle();

    setIsSaved(!!data);
  }

  async function toggleSave(onUnSave?: () => void) {
    if (!userId) return;
    setSaveLoading(true);
    try {
      if (isSaved) {
        const { error } = await authSupabase
          .from("saved_properties")
          .delete()
          .eq("user_clerk_id", userId)
          .eq("property_id", propertyID);
        if (error) throw error;
        setIsSaved(false);
        onUnSave?.();
      } else {
        const { error } = await authSupabase
          .from("saved_properties")
          .insert({ user_clerk_id: userId, property_id: propertyID });
        if (error) throw error;
        setIsSaved(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSaveLoading(false);
    }
   }

  return { isSaved, saveLoading, toggleSave };
}
