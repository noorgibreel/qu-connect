import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const restUrl = `${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`;

console.log('Fetching OpenAPI schema from:', restUrl);

async function getSpec() {
  try {
    const res = await fetch(restUrl);
    const spec = await res.json();
    console.log('Keys of spec:', Object.keys(spec));
    console.log('Spec body:', spec);
    if (spec.paths) {
      console.log('Paths found:', Object.keys(spec.paths).slice(0, 10));
    }
    if (spec.components) {
      console.log('Components schemas found:', Object.keys(spec.components.schemas || {}));
      fs.writeFileSync('scratch/schema-definitions.json', JSON.stringify(spec.components.schemas, null, 2));
    }

    
    // Print fields for some important tables
    const tables = ['colleges', 'majors', 'interests', 'goals', 'profiles', 'user_interests', 'user_goals', 'social_preferences'];
    const schemas = spec.components?.schemas || spec.definitions || {};
    tables.forEach(table => {
      if (schemas[table]) {
        console.log(`\nTable: ${table}`);
        const props = schemas[table].properties;
        if (props) {
          Object.keys(props).forEach(prop => {
            console.log(`  - ${prop}: ${props[prop].type} (${props[prop].format || 'no format'})`);
          });
        }
      } else {
        console.log(`Table ${table} not found in schemas.`);
      }
    });
  } catch (e) {
    console.error('Error fetching OpenAPI schema:', e);
  }
}

getSpec();
