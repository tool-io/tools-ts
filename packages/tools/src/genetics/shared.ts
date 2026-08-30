import { simpleError } from "../core/simple.js";

export const count = (value: number, field: string, minimum = 0): number => {
  if (!Number.isSafeInteger(value) || value < minimum)
    simpleError(field, `An integer of at least ${minimum} is required.`);
  return value;
};
export const positive = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value <= 0)
    simpleError(field, "A positive finite value is required.");
  return value;
};
export const fraction = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value < 0 || value > 1)
    simpleError(field, "A fraction in [0,1] is required.");
  return value;
};
export const nonnegative = (value: number, field: string): number => {
  if (!Number.isFinite(value) || value < 0)
    simpleError(field, "A nonnegative finite value is required.");
  return value;
};
export const dna = (value: string): string => {
  const sequence = value.trim().toUpperCase();
  if (!/^[ACGT]+$/.test(sequence))
    simpleError("sequence", "Canonical A/C/G/T DNA is required.");
  return sequence;
};
export const aligned = (
  first: readonly unknown[],
  second: readonly unknown[],
  field: string,
): void => {
  if (!first.length || first.length !== second.length)
    simpleError(field, "Aligned nonempty lists are required.");
};
export const codonAminoAcid = (codon: string): string => {
  const bases = "TCAG",
    aminoAcids =
      "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  if (!/^[ACGT]{3}$/.test(codon))
    simpleError("codon", "A canonical triplet codon is required.");
  return aminoAcids[
    bases.indexOf(codon[0]) * 16 +
      bases.indexOf(codon[1]) * 4 +
      bases.indexOf(codon[2])
  ];
};
