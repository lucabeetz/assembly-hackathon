// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const API_QUERY_ENDPOINT = "http://assembly.ayfdhubah8c7hvg5.germanywestcentral.azurecontainer.io/query";

console.log("Query function starting...");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { query } = await req.json()
  console.log(`Received query: ${query}`);

  // Make request to API
  const apiResponse = await fetch(API_QUERY_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: { "Content-Type": "application/json" },
  });
  const responseBody = await apiResponse.json();

  return new Response(
    JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
