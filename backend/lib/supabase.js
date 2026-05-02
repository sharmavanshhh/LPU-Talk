/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Supabase Client Configuration
 *  Creates two Supabase client instances:
 *    1. supabase      → uses ANON key (respects RLS policies)
 *    2. supabaseAdmin → uses SERVICE_ROLE key (bypasses RLS — server only)
 * ═══════════════════════════════════════════════════════════════════════
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — respects Row Level Security (RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — bypasses RLS, used for server-side operations like
// creating profiles on signup. NEVER expose to the browser.
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = { supabase, supabaseAdmin };
