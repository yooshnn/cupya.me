import { createD1Client } from '@cupya.me/db/d1';
import * as schema from './schema';

export function getDB(d1: D1Database) {
  return createD1Client(d1, schema);
}
