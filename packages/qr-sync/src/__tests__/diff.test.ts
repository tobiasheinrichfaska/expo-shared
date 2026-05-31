import { createSyncEngine } from '../diff';

interface Demo {
  version: number;
  groups: { id: string; name: string }[];
  athletes: { id: string; name: string }[];
}

const engine = createSyncEngine<Demo>({ collections: ['groups', 'athletes'] });

const base = (): Demo => ({
  version: 1,
  groups: [{ id: 'g1', name: 'Kids' }],
  athletes: [{ id: 'a1', name: 'Mia' }],
});

describe('detectChanges', () => {
  it('classifies imported items as new / changed / unchanged', () => {
    const local = base();
    const imported: Demo = {
      version: 1,
      groups: [
        { id: 'g1', name: 'Kids' }, // unchanged
        { id: 'g2', name: 'Youth' }, // new
      ],
      athletes: [{ id: 'a1', name: 'Mia R.' }], // changed
    };

    const changes = engine.detectChanges(local, imported);

    expect(changes.unchanged.groups).toEqual([{ id: 'g1', name: 'Kids' }]);
    expect(changes.new.groups).toEqual([{ id: 'g2', name: 'Youth' }]);
    expect(changes.changed.athletes).toEqual([{ id: 'a1', name: 'Mia R.' }]);
    expect(changes.new.athletes).toEqual([]);
  });
});

describe('applyChanges', () => {
  it('replaces changed items by id, appends new ones, keeps the rest', () => {
    const local = base();
    const imported: Demo = {
      version: 1,
      groups: [{ id: 'g2', name: 'Youth' }],
      athletes: [{ id: 'a1', name: 'Mia R.' }],
    };
    const merged = engine.applyChanges(local, engine.detectChanges(local, imported));

    expect(merged.groups).toEqual([
      { id: 'g1', name: 'Kids' },
      { id: 'g2', name: 'Youth' },
    ]);
    expect(merged.athletes).toEqual([{ id: 'a1', name: 'Mia R.' }]); // replaced, not duplicated
    expect(merged.version).toBe(1); // non-collection field carried over
  });

  it('is a no-op when imported equals local', () => {
    const local = base();
    const merged = engine.applyChanges(local, engine.detectChanges(local, base()));
    expect(merged).toEqual(local);
  });
});

describe('exportSelected', () => {
  it('keeps only the collections flagged true; empties the rest', () => {
    const out = engine.exportSelected(base(), { groups: true });
    expect(out.groups).toHaveLength(1);
    expect(out.athletes).toEqual([]);
    expect(out.version).toBe(1);
  });
});
