import { simpleError } from "../core/simple.js";
import { bounded, binary, positive } from "../ergonomics/shared.js";
import { shape } from "../archaeology/shared.js";
import { lines } from "../museology/shared.js";
export * from "../ergonomics/shared.js";
export const cssNumber = (v: number): string =>
  String(Object.is(v, -0) ? 0 : Number(v.toPrecision(12)));
export const uniqueNames = (text: string): string[] => {
  const names = lines(text, "names");
  if (
    names.some((v) => !/^[A-Za-z_][A-Za-z0-9_-]{0,63}$/.test(v)) ||
    new Set(names).size !== names.length
  )
    simpleError("names", "Unique bounded ASCII identifier names required.");
  return names;
};
export const closure = (
  required: readonly number[],
  dependency: readonly (readonly number[])[],
): number[] => {
  const n = dependency.length;
  if (shape(dependency, "dependencies") !== n)
    simpleError("dependencies", "Square glyph-dependency adjacency required.");
  dependency.forEach((r) => binary(r, "dependencies"));
  required.forEach((v) => bounded(v, "glyph", 0, n - 1));
  const queue = [...new Set(required)],
    seen = new Set(queue);
  for (let q = 0; q < queue.length; q++)
    for (let j = 0; j < n; j++)
      if (dependency[queue[q]][j] && !seen.has(j)) {
        seen.add(j);
        queue.push(j);
      }
  return queue.sort((a, b) => a - b);
};
export const fontMetrics = (
  hex: string,
): { unitsPerEm: number; xHeight: number; hasXHeight: boolean } => {
  if (hex.length > 1000000 || hex.length % 2 || !/^[0-9a-fA-F]+$/.test(hex))
    return simpleError(
      "fontFileHex",
      "Bounded even-length hex SFNT bytes required (not compressed WOFF or a collection).",
    );
  const bytes = Uint8Array.from(hex.match(/../g) ?? [], (s) => parseInt(s, 16)),
    view = new DataView(bytes.buffer),
    size = bytes.length;
  if (size < 12)
    return simpleError("fontFileHex", "Complete SFNT offset header required.");
  const tag = (at: number) => String.fromCharCode(...bytes.slice(at, at + 4)),
    signature = view.getUint32(0);
  if (signature !== 0x00010000 && tag(0) !== "OTTO")
    return simpleError(
      "fontFileHex",
      "Standalone TrueType/OpenType SFNT signature required.",
    );
  const n = bounded(view.getUint16(4), "tables", 1, 128),
    end = 12 + 16 * n;
  if (end > size)
    return simpleError("fontFileHex", "Truncated SFNT table directory.");
  const tables = new Map<string, { offset: number; length: number }>();
  for (let j = 0; j < n; j++) {
    const at = 12 + 16 * j,
      name = tag(at),
      offset = view.getUint32(at + 8),
      length = view.getUint32(at + 12);
    if (tables.has(name) || offset < end || offset + length > size)
      return simpleError(
        "fontFileHex",
        "Unique in-bounds SFNT table records required.",
      );
    tables.set(name, { offset, length });
  }
  const ranges = [...tables.values()]
    .filter((t) => t.length > 0)
    .sort((a, b) => a.offset - b.offset);
  if (
    ranges.some(
      (r, i) => i > 0 && r.offset < ranges[i - 1].offset + ranges[i - 1].length,
    )
  )
    return simpleError(
      "fontFileHex",
      "Overlapping SFNT tables are not supported.",
    );
  const head = tables.get("head");
  if (
    !head ||
    head.length < 54 ||
    view.getUint32(head.offset + 12) !== 0x5f0f3cf5
  )
    return simpleError(
      "fontFileHex",
      "Complete head table with required magic number needed.",
    );
  const upm = bounded(
      view.getUint16(head.offset + 18),
      "unitsPerEm",
      16,
      16384,
    ),
    os2 = tables.get("OS/2");
  if (!os2) return { unitsPerEm: upm, xHeight: 0, hasXHeight: false };
  if (os2.length < 2)
    return simpleError("fontFileHex", "Truncated OS/2 version.");
  const version = view.getUint16(os2.offset);
  if (version < 2) return { unitsPerEm: upm, xHeight: 0, hasXHeight: false };
  if (os2.length < 96)
    return simpleError(
      "fontFileHex",
      "OS/2 v2+ requires the complete 96-byte minimum metric table.",
    );
  const x = view.getInt16(os2.offset + 86);
  if (x < 0)
    return simpleError("fontFileHex", "Native x-height cannot be negative.");
  return { unitsPerEm: upm, xHeight: x, hasXHeight: x > 0 };
};
