import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseClient;