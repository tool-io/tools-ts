import { simpleError } from "../core/simple.js";

export const hash32 = (value: string, seed: number): number => {
  let h = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
};

export const hyperLogLog = (
  items: readonly string[],
  precision: number,
): { estimate: number; registers: number } => {
  const m = 2 ** precision;
  const registers = new Uint8Array(m);
  for (const item of new Set(items)) {
    const hash = hash32(item, 0x734f);
    const index = hash >>> (32 - precision);
    const remainder = (hash << precision) >>> 0;
    const rank = Math.min(32 - precision + 1, Math.clz32(remainder) + 1);
    registers[index] = Math.max(registers[index]!, rank);
  }
  const alpha =
    m === 16
      ? 0.673
      : m === 32
        ? 0.697
        : m === 64
          ? 0.709
          : 0.7213 / (1 + 1.079 / m);
  let inverseSum = 0,
    zeros = 0;
  for (const rank of registers) {
    inverseSum += 2 ** -rank;
    if (!rank) zeros++;
  }
  const raw = (alpha * m * m) / inverseSum;
  const estimate = raw <= 2.5 * m && zeros > 0 ? m * Math.log(m / zeros) : raw;
  return { estimate, registers: m };
};

export const minHash = (items: readonly string[], count: number): number[] => {
  if (count < 1 || count > 256)
    simpleError("hashCount", "Use 1–256 hash functions.");
  const unique = [...new Set(items)];
  return Array.from({ length: count }, (_, i) =>
    unique.reduce(
      (minimum, item) => Math.min(minimum, hash32(item, i + 1)),
      0xffffffff,
    ),
  );
};

export const minHashComparison = (
  left: readonly string[],
  right: readonly string[],
  count: number,
) => {
  const first = minHash(left, count);
  const second = minHash(right, count);
  const matches = first.reduce(
    (total, hash, index) => total + Number(hash === second[index]),
    0,
  );
  const union = new Set([...left, ...right]);
  const rightSet = new Set(right);
  const intersection = new Set(left.filter((item) => rightSet.has(item)));
  return {
    estimatedJaccard: matches / count,
    exactJaccard: union.size === 0 ? 1 : intersection.size / union.size,
    leftSignature: first,
    rightSignature: second,
  };
};

export const localitySensitiveHash = (
  left: readonly string[],
  right: readonly string[],
  hashCount: number,
  bandCount: number,
) => {
  if (hashCount % bandCount !== 0)
    simpleError("bandCount", "Band count must divide hash count.");
  const first = minHash(left, hashCount);
  const second = minHash(right, hashCount);
  const rows = hashCount / bandCount;
  const matchingBands: number[] = [];
  for (let band = 0; band < bandCount; band++)
    if (
      first
        .slice(band * rows, (band + 1) * rows)
        .every((value, i) => value === second[band * rows + i])
    )
      matchingBands.push(band);
  return { candidate: matchingBands.length > 0, matchingBands };
};
