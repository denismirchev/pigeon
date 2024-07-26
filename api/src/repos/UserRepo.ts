import { db } from '@src/config/db';
import { users, IUser } from '@src/models/User';

// **** Functions **** //

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  const [user] = await db.select().from(users).where(users.email.eq(email));
  return user || null;
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const [user] = await db.select().from(users).where(users.id.eq(id));
  return !!user;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  return await db.select().from(users);
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  await db.insert(users).values(user);
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  await db.update(users).set(user).where(users.id.eq(user.id));
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  await db.delete(users).where(users.id.eq(id));
}

// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
} as const;