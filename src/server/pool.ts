import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../../.env.local') });

import { Pool } from 'pg';

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString
});

export default pool;
