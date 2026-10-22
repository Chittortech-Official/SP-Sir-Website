import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vqtbrmesjdubznmtpmla.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdGJybWVzamR1YnpubXRwbWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NzgwMDYsImV4cCI6MjEwNzU1NDAwNn0.fUgUs36Q8mspvz5C6F7cMKR1cNZn6ozxactPM6hLikM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  // Update Dharmendra Sir (SP)
  await supabase.from('officer_profiles').update({
    phone: '01472-240006 / 94604-25643'
  }).eq('id', 'eaddd30b-4a41-46e6-a9ad-4fb5e61f571d');

  // Update Gajendra Sir (Addl SP)
  await supabase.from('officer_profiles').update({
    phone: '01472-242603 / 94144-81105'
  }).eq('id', '2dfaca8c-369e-4d94-aee7-e04f6e9aac21');

  const { data } = await supabase.from('officer_profiles').select('id, name, designation, phone');
  console.log('Current in Supabase:', JSON.stringify(data, null, 2));
}

main();
