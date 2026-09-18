import { useAuth } from "@clerk/expo";
import { useMemo } from "react";
import { createClerkSupaBaseClient } from "../lib/supabase";

export function useSupabase() {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    return createClerkSupaBaseClient(() => getToken());
  }, [getToken]);

  return client;
}
