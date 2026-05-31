/** Anything with a stable string `id` can be synced. */
export interface Identifiable {
  id: string;
}

/** The keys of `T` whose values are arrays of {@link Identifiable} ("collections"). */
export type CollectionKey<T> = {
  [K in keyof T]: T[K] extends Identifiable[] ? K : never;
}[keyof T];

/** A subset of `T` containing only its collection arrays. */
export type Buckets<T> = { [K in CollectionKey<T>]: T[K] };

export interface ChangeDetection<T> {
  /** Imported items with ids not present locally. */
  new: Buckets<T>;
  /** Imported items whose id exists locally but content differs. */
  changed: Buckets<T>;
  /** Imported items identical to the local copy. */
  unchanged: Buckets<T>;
}

/** Which collections to include in an export. Include a collection when its flag is `true`. */
export type Selection<T> = Partial<Record<CollectionKey<T>, boolean>>;

export interface SyncEngineOptions<T> {
  /** The collection keys of `T` to sync (each must be an array of `{ id }`). */
  collections: ReadonlyArray<CollectionKey<T>>;
}

export interface SyncEngine<T> {
  exportSelected(data: T, selection: Selection<T>): T;
  detectChanges(local: T, imported: T): ChangeDetection<T>;
  applyChanges(local: T, changes: ChangeDetection<T>): T;
}

/**
 * Build a sync engine bound to a data shape `T` and its collection keys.
 *
 * The engine is schema-agnostic: it only knows that the named keys hold arrays of
 * `{ id }` items. Non-collection fields (e.g. a `version` number) are carried over
 * from the local data untouched.
 *
 * @example
 *   const engine = createSyncEngine<AppData>({
 *     collections: ['groups', 'athletes', 'games', 'sessionPlans', 'sessionLogs', 'assessments'],
 *   });
 */
export function createSyncEngine<T extends object>(options: SyncEngineOptions<T>): SyncEngine<T> {
  const { collections } = options;

  const arr = (data: T, key: CollectionKey<T>): Identifiable[] =>
    (data[key] as unknown as Identifiable[] | undefined) ?? [];

  const emptyBuckets = (): Buckets<T> => {
    const buckets = {} as Buckets<T>;
    for (const key of collections) {
      (buckets as Record<CollectionKey<T>, Identifiable[]>)[key] = [];
    }
    return buckets;
  };

  function exportSelected(data: T, selection: Selection<T>): T {
    const out = { ...data } as T;
    for (const key of collections) {
      (out as Record<CollectionKey<T>, Identifiable[]>)[key] = selection[key] ? arr(data, key) : [];
    }
    return out;
  }

  function detectChanges(local: T, imported: T): ChangeDetection<T> {
    const result: ChangeDetection<T> = {
      new: emptyBuckets(),
      changed: emptyBuckets(),
      unchanged: emptyBuckets(),
    };
    for (const key of collections) {
      const localById = new Map(arr(local, key).map((e) => [e.id, e]));
      for (const item of arr(imported, key)) {
        const existing = localById.get(item.id);
        const bucket = !existing
          ? result.new
          : JSON.stringify(existing) !== JSON.stringify(item)
          ? result.changed
          : result.unchanged;
        (bucket as Record<CollectionKey<T>, Identifiable[]>)[key].push(item);
      }
    }
    return result;
  }

  function applyChanges(local: T, changes: ChangeDetection<T>): T {
    const out = { ...local } as T;
    for (const key of collections) {
      const changedById = new Map(
        (changes.changed[key] as unknown as Identifiable[]).map((e) => [e.id, e]),
      );
      const added = changes.new[key] as unknown as Identifiable[];
      (out as Record<CollectionKey<T>, Identifiable[]>)[key] = [
        ...arr(local, key).map((e) => changedById.get(e.id) ?? e),
        ...added,
      ];
    }
    return out;
  }

  return { exportSelected, detectChanges, applyChanges };
}
