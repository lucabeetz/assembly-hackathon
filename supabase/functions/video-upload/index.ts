// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TRANSCRIPTION_API_ENDPOINT = 'https://62cc-188-195-2-108.eu.ngrok.io/transcribe';

console.log("video-upload function running ...")

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

  // Create new table entry to get video_id
  const insertResponse = await supabase
    .from("videos")
    .insert({ video_url })
    .select("id");
  const video_id = insertResponse.data?.[0].id;
  console.log(video_id);
  

  // Submit video for transcription to api
  const transcriptionResponse = await fetch(TRANSCRIPTION_API_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ video_id, video_url }),
    headers: { "Content-Type": "application/json" },
  });
  const transcriptionResponseBody = await transcriptionResponse.json();
  const { video_title, video_thumbnail, transcription_id} = transcriptionResponseBody;

  // Save title and thumbnail to videos table
  const upsertRes = await supabase
    .from("videos")
    .upsert({ id: video_id, title: video_title, thumbnail: video_thumbnail })
    .select("id");
  console.log(upsertRes);

  const responseBody = {
    video_id,
  }

  return new Response(
    JSON.stringify(responseBody),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
