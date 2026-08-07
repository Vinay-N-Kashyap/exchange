import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://tasaixjwlothmqgvaenv.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc2FpeGp3bG90aG1xZ3ZhZW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0ODMwNTcsImV4cCI6MjEwMDA1OTA1N30.Pcl7qIVJGoKMTyJD7rrNmqSDHfMatrpOmIFdAjwL4yg';

export const supabaseServer = createClient(supabaseUrl, supabaseKey);

console.log("⚡ Connected to PinIT Hub Supabase Project:", supabaseUrl);
