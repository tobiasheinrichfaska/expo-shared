import { encodeToChunks, assembleFromChunks, QRChunk } from '../chunks';

describe('chunks encode/assemble', () => {
  it('round-trips a payload through encode → assemble', () => {
    const data = { version: 1, items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }], note: 'äöü €' };
    const chunks = encodeToChunks(data);
    const restored = assembleFromChunks<typeof data>(chunks);
    expect(restored).toEqual(data);
  });

  it('splits large payloads into multiple chunks that reassemble in any order', () => {
    const data = { items: Array.from({ length: 500 }, (_, i) => ({ id: String(i), v: i })) };
    const chunks = encodeToChunks(data, 200);
    expect(chunks.length).toBeGreaterThan(1);

    const parsed = chunks.map((c) => JSON.parse(c) as QRChunk);
    expect(parsed.every((c) => c.total === chunks.length)).toBe(true);

    const shuffled = [...chunks].reverse();
    expect(assembleFromChunks<typeof data>(shuffled)).toEqual(data);
  });

  it('always produces at least one chunk, even for tiny payloads', () => {
    expect(encodeToChunks({}).length).toBe(1);
  });
});
