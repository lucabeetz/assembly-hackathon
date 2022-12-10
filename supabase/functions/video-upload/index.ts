// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.log("Hello from Functions!")

serve(async (req) => {
  const { video_url } = await req.json()
  const data = {
    message: `Received ${video_url} ...`,
  };

  // Get supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  // Get transcription, title and thumbnail from api
  const title = "CS50P - Lecture 5 - Unit Tests";
  const thumbnail = "https://i.ytimg.com/vi/3Q_oYDQ2whs/maxresdefault.jpg";

  // Save title and thumbnail to videos table
  const upsertRes = await supabase
    .from("videos")
    .insert({ title, thumbnail, video_url })
    .select("id");

  console.log(upsertRes);

  // Save transcription to storage

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
