import { simpleError } from "../core/simple.js";

export const count = (value: number, field: string, minimum = 0): number => {
  if (!Number.isSafeInteger(value) || value < minimum)
    simpleError(field, `An integer of at least ${minimum} is required.`);
  return value;
};
export const fraction = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value < 0 || value > 1)
    simpleError(field, "A fraction between zero and one is required.");
  return value;
};
export const positive = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value <= 0)
    simpleError(field, "A positive finite value is required.");
  return value;
};
export const counts = (
  values: readonly number[],
  field: string,
  allowEmpty = false,
): void => {
  if (!allowEmpty && !values.length)
    simpleError(field, "A nonempty list is required.");
  values.forEach((value) => count(value, field));
};
export const dna = (sequence: string): string => {
  const value = sequence.trim().toUpperCase();
  if (!/^[ACGT]+$/.test(value))
    simpleError("sequence", "Canonical A/C/G/T DNA is required.");
  return value;
};
export const reverseDNA = (sequence: string): string => {
  const map: Readonly<Record<string, string>> = {
    A: "T",
    C: "G",
    G: "C",
    T: "A",
  };
  return [...dna(sequence)]
    .reverse()
    .map((base) => map[base])
    .join("");
};
export const rectangular = (
  matrix: readonly (readonly number[])[],
  field: string,
): void => {
  if (
    !matrix.length ||
    !matrix[0].length ||
    matrix.some(
      (row) =>
        row.length !== matrix[0].length ||
        row.some((v) => !Number.isFinite(v) || v < 0),
    )
  )
    simpleError(
      field,
      "A nonempty rectangular nonnegative matrix is required.",
    );
};
export const cigarTokens = (
  cigar: string,
): readonly Readonly<{ length: number; op: string }>[] => {
  if (!/^(?:[1-9][0-9]*[MIDNSHP=X])+$/.test(cigar))
    simpleError(
      "cigar",
      "A complete CIGAR string with positive lengths is required.",
    );
  return [...cigar.matchAll(/([0-9]+)([MIDNSHP=X])/g)].map((match) => ({
    length: count(Number(match[1]), "cigar", 1),
    op: match[2],
  }));
};
export const assemblyNx = (
  lengths: readonly number[],
  targetBases: number,
): Readonly<{ length: number; contigs: number; reached: boolean }> => {
  counts(lengths, "contigLengths");
  positive(targetBases, "targetBases");
  const sorted = [...lengths].sort((a, b) => b - a);
  let bases = 0;
  for (let i = 0; i < sorted.length; i++) {
    bases += sorted[i];
    if (bases >= targetBases)
      return { length: sorted[i], contigs: i + 1, reached: true };
  }
  return { length: 0, contigs: sorted.length, reached: false };
};
