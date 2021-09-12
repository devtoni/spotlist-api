import { v4 as uuidv4 } from 'uuid';

class IdentityManager {
  next(): string {
    return uuidv4();
  }
}

export { IdentityManager };
