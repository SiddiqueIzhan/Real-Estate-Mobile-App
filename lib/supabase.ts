import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

// import 'expo-sqlite/localStorage/install'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
);

export function createClerkSupaBaseClient(
  getToken: () => Promise<string | null>,
) {
  return createClient(supabaseUrl, supabasePublishableKey, {
    async accessToken() {
      return getToken();
    },
  });
}
