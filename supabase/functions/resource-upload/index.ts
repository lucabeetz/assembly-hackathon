// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const UPLOAD_ENDPOINT = "http://assembly.ayfdhubah8c7hvg5.germanywestcentral.azurecontainer.io/upload";

console.log("Hello from Functions!")

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const formData = await req.formData()

  // Get data from request
  const resourceTitle = formData.get("resource_title");
  const file = formData.get("file");

  // Get supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  // Create new table entry
  const insertResponse = await supabase
    .from("resources")
    .insert({ title: resourceTitle })
    .select("id");

  console.log(insertResponse);
  const resourceId = insertResponse.data?.[0].id;

  // Save to storage
  const storageResponse = await supabase
    .storage
    .from("public")
    .upload(`${resourceId}.pdf`, file!);
  console.log(storageResponse);

  // Send API request 
  const uploadData = new FormData();
  uploadData.append("file", file!)
  uploadData.append("resource_id", resourceId);

  const apiResponse = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    body: uploadData,  
  });
  const apiResponseBody = await apiResponse.json();
  console.log(apiResponse);

  return new Response(
    JSON.stringify(apiResponseBody),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
