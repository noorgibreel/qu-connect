import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL || '';
const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

async function check() {
  const endpoint = `${url}/rest/v1/`;
  console.log(`Fetching OpenAPI spec from: ${endpoint}`);
  const res = await fetch(endpoint, {
    headers: {
      'apikey': apiKey
    }
  });
  const spec = await res.json();
  const connectionsDef = spec.definitions?.connections;
  if (connectionsDef) {
    console.log("Found 'connections' table definition:");
    console.log(JSON.stringify(connectionsDef, null, 2));
  } else {
    console.log("Connections definition not found. Available definitions:", Object.keys(spec.definitions || {}));
  }
}

check();
