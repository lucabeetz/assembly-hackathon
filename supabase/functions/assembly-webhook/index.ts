// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { corsHeaders } from "../_shared/cors.ts";

console.log("assembly-webhook function starting...");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Get supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  const { transcription_id, paragraphs, video_id } = await req.json()
  console.log(`Received transcription: ${transcription_id}`);

  // Save paragraphs to storage
  const storageResponse = await supabase
    .storage
    .from('public')
    .upload(`${video_id}.json`, JSON.stringify({ paragraphs }));

  // Set video status to complete
  const upsertRes = await supabase
    .from('videos')
    .upsert({ id: video_id, processed: true });

  const responseBody = {
    transcription_id,
  }

  return new Response(
    JSON.stringify(responseBody),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
