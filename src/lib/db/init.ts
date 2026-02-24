import { getDatabase } from './index';

console.log('Initializing database...');
const db = getDatabase();
console.log('Database initialized successfully at data/stuckatstack.db');
console.log('Tables created: recommendations');
process.exit(0);
