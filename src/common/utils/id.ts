import { v5 as uuidv5 } from 'uuid';

export function generateDeterministicUUID(a: string, b: string): string {
  const [first, second] = [a, b].sort();
  return uuidv5(first, second);
}
