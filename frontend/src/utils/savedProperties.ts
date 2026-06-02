import { storage } from "@/src/utils/storage";

const SAVED_KEY = "splitfinder.saved.v1";

export async function getSavedIds(): Promise<string[]> {
  const raw = await storage.getItem<string>(SAVED_KEY, "[]");
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function isSaved(id: string): Promise<boolean> {
  const ids = await getSavedIds();
  return ids.includes(id);
}

export async function toggleSaved(id: string): Promise<boolean> {
  const ids = await getSavedIds();
  let next: string[];
  if (ids.includes(id)) {
    next = ids.filter((x) => x !== id);
  } else {
    next = [...ids, id];
  }
  await storage.setItem(SAVED_KEY, JSON.stringify(next));
  return next.includes(id);
}

export async function removeSaved(id: string): Promise<void> {
  const ids = await getSavedIds();
  const next = ids.filter((x) => x !== id);
  await storage.setItem(SAVED_KEY, JSON.stringify(next));
}
