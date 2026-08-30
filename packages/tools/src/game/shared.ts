import { simpleError, type SimpleField } from "../core/simple.js";
import {
  bounded,
  shape,
  validateInput as validateBaseInput,
} from "../ergonomics/shared.js";
export * from "../ergonomics/shared.js";
export * from "./cards.js";
export * from "./chess.js";
export const validateInput = (
  input: unknown,
  fields: readonly SimpleField[],
): void => {
  validateBaseInput(input, fields);
  const dense = (values: readonly unknown[], field: string): void => {
    for (let i = 0; i < values.length; i++)
      if (!Object.hasOwn(values, i))
        simpleError(
          field,
          "Dense explicit evidence arrays required; sparse missing cells are not observations.",
        );
  };
  for (const f of fields) {
    const v = (input as Record<string, unknown>)[f.id];
    if (Array.isArray(v)) {
      dense(v, f.id);
      if (f.kind === "matrix") for (const row of v) dense(row, f.id);
    }
  }
};
export const grid = (
  board: readonly (readonly number[])[],
  allowed: readonly number[],
  max = 32,
): number => {
  const w = shape(board, "board");
  if (
    w > max ||
    board.length > max ||
    board.some((r) => r.some((v) => !allowed.includes(v)))
  )
    simpleError(
      "board",
      "Bounded rectangular board with declared discrete cells required.",
    );
  return w;
};
export const at = (
  board: readonly (readonly number[])[],
  row: number,
  col: number,
): number => {
  bounded(row, "row", 0, board.length - 1);
  bounded(col, "column", 0, (board[0]?.length ?? 0) - 1);
  return board[row][col];
};
export const elo = (
  rating: number,
  opponent: number,
  scale: number,
): number => {
  if (
    !Number.isFinite(scale) ||
    scale <= 0 ||
    Math.abs(rating) > 1000000 ||
    Math.abs(opponent) > 1000000
  )
    simpleError(
      "rating",
      "Finite bounded ratings and positive Elo scale required.",
    );
  const z = ((opponent - rating) / scale) * Math.LN10;
  return z >= 0 ? Math.exp(-z) / (1 + Math.exp(-z)) : 1 / (1 + Math.exp(z));
};
export const choose = (n: number, k: number): bigint => {
  bounded(n, "population", 0, 10000);
  bounded(k, "selection", 0, n);
  k = Math.min(k, n - k);
  let value = 1n;
  for (let j = 1; j <= k; j++) value = (value * BigInt(n - k + j)) / BigInt(j);
  return value;
};
export const dice = (values: readonly number[], expected = 5): void => {
  if (values.length !== expected)
    simpleError("dice", `Exactly ${expected} d6 outcomes required.`);
  values.forEach((v) => bounded(v, "die", 1, 6));
};
export const frequencies = (
  values: readonly (number | string)[],
): Map<number | string, number> => {
  const m = new Map<number | string, number>();
  values.forEach((v) => m.set(v, (m.get(v) ?? 0) + 1));
  return m;
};
export const feedback = (
  answer: readonly (number | string)[],
  guess: readonly (number | string)[],
): number[] => {
  if (!answer.length || answer.length !== guess.length || answer.length > 128)
    simpleError("guess", "Aligned bounded nonempty answer/guess required.");
  const result: number[] = guess.map((v, i) => (v === answer[i] ? 2 : 0)),
    left = frequencies(answer.filter((_, i) => result[i] !== 2));
  guess.forEach((v, i) => {
    if (result[i] === 0 && (left.get(v) ?? 0) > 0) {
      result[i] = 1;
      left.set(v, left.get(v)! - 1);
    }
  });
  return result;
};
