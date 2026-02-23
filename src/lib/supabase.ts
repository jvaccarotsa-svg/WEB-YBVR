import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('--- Supabase Config ---');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseAnonKey.length);

if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co') {
    console.warn('Supabase URL is missing or using placeholder. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
)

