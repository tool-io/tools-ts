import { simpleError } from "./simple.js";

export const proteinSequence = (sequence: string): string => {
  const value = sequence.trim().toUpperCase();
  if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/.test(value))
    simpleError(
      "sequence",
      "A nonempty sequence of canonical amino acids is required.",
    );
  return value;
};

// Residue masses exclude the water lost when amino acids join a peptide chain.
export const monoisotopicResidueMass: Readonly<Record<string, number>> = {
  A: 71.03711,
  C: 103.00919,
  D: 115.02694,
  E: 129.04259,
  F: 147.06841,
  G: 57.02146,
  H: 137.05891,
  I: 113.08406,
  K: 128.09496,
  L: 113.08406,
  M: 131.04049,
  N: 114.04293,
  P: 97.05276,
  Q: 128.05858,
  R: 156.10111,
  S: 87.03203,
  T: 101.04768,
  V: 99.06841,
  W: 186.07931,
  Y: 163.06333,
};

export const averageResidueMass: Readonly<Record<string, number>> = {
  A: 71.0788,
  C: 103.1388,
  D: 115.0886,
  E: 129.1155,
  F: 147.1766,
  G: 57.0519,
  H: 137.1411,
  I: 113.1594,
  K: 128.1741,
  L: 113.1594,
  M: 131.1926,
  N: 114.1038,
  P: 97.1167,
  Q: 128.1307,
  R: 156.1875,
  S: 87.0782,
  T: 101.1051,
  V: 99.1326,
  W: 186.2132,
  Y: 163.176,
};

export const kyteDoolittleHydropathy: Readonly<Record<string, number>> = {
  A: 1.8,
  C: 2.5,
  D: -3.5,
  E: -3.5,
  F: 2.8,
  G: -0.4,
  H: -3.2,
  I: 4.5,
  K: -3.9,
  L: 3.8,
  M: 1.9,
  N: -3.5,
  P: -1.6,
  Q: -3.5,
  R: -4.5,
  S: -0.8,
  T: -0.7,
  V: 4.2,
  W: -0.9,
  Y: -1.3,
};

export const peptideNeutralMass = (
  sequence: string,
  residueMasses: Readonly<Record<string, number>> = monoisotopicResidueMass,
  waterMassDa = 18.01056,
): number =>
  [...proteinSequence(sequence)].reduce(
    (sum, residue) => sum + residueMasses[residue],
    waterMassDa,
  );

export const trypsinCutPositions = (sequence: string): number[] => {
  const s = proteinSequence(sequence);
  const positions: number[] = [];
  for (let i = 0; i < s.length - 1; i++)
    if ((s[i] === "K" || s[i] === "R") && s[i + 1] !== "P")
      positions.push(i + 1);
  return positions;
};

// Residue formulas exclude the terminal H2O present in a complete chain.
export const residueElements: Readonly<Record<string, readonly number[]>> = {
  A: [3, 5, 1, 1, 0],
  C: [3, 5, 1, 1, 1],
  D: [4, 5, 1, 3, 0],
  E: [5, 7, 1, 3, 0],
  F: [9, 9, 1, 1, 0],
  G: [2, 3, 1, 1, 0],
  H: [6, 7, 3, 1, 0],
  I: [6, 11, 1, 1, 0],
  K: [6, 12, 2, 1, 0],
  L: [6, 11, 1, 1, 0],
  M: [5, 9, 1, 1, 1],
  N: [4, 6, 2, 2, 0],
  P: [5, 7, 1, 1, 0],
  Q: [5, 8, 2, 2, 0],
  R: [6, 12, 4, 1, 0],
  S: [3, 5, 1, 2, 0],
  T: [4, 7, 1, 2, 0],
  V: [5, 9, 1, 1, 0],
  W: [11, 10, 2, 1, 0],
  Y: [9, 9, 1, 2, 0],
};

export const proteinCharge = (
  sequence: string,
  ph: number,
  // N terminus, C terminus, Lys, Arg, His, Asp, Glu, Cys, Tyr.
  pkas: readonly number[],
): number => {
  const s = proteinSequence(sequence);
  if (pkas.length !== 9 || pkas.some((value) => !Number.isFinite(value)))
    simpleError(
      "pkas",
      "Nine finite terminal and side-chain pKa values are required.",
    );
  const count = (residue: string) =>
    [...s].filter((value) => value === residue).length;
  const positive = (pka: number) => 1 / (1 + 10 ** (ph - pka));
  const negative = (pka: number) => 1 / (1 + 10 ** (pka - ph));
  return (
    positive(pkas[0]) -
    negative(pkas[1]) +
    count("K") * positive(pkas[2]) +
    count("R") * positive(pkas[3]) +
    count("H") * positive(pkas[4]) -
    count("D") * negative(pkas[5]) -
    count("E") * negative(pkas[6]) -
    count("C") * negative(pkas[7]) -
    count("Y") * negative(pkas[8])
  );
};
