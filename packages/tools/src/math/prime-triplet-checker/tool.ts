import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, prime } from "../batch-shared.js";
export type Input = Readonly<{ readonly candidateTriplet: readonly number[] }>;
export type Output = Readonly<{
  readonly allThreeArePrime: boolean;
  readonly allowedTripletGapPattern: boolean;
  readonly isPrimeTriplet: boolean;
}>;
const inputFields = [
  { id: "candidateTriplet", label: "Candidate triplet", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.candidateTriplet.length !== 3 ||
    input.candidateTriplet.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        v < 2 ||
        v > 1000000 ||
        (i > 0 && v <= input.candidateTriplet[i - 1]),
    )
  )
    simpleError("triplet", "Three increasing bounded integers ≥2 required.");
  const [a, b, c] = input.candidateTriplet,
    all = input.candidateTriplet.every(prime),
    pattern =
      (c - a === 6 && (b - a === 2 || b - a === 4)) ||
      (a === 3 && b === 5 && c === 7);
  return {
    allThreeArePrime: all,
    allowedTripletGapPattern: pattern,
    isPrimeTriplet: all && pattern,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { candidateTriplet: [5, 7, 11] } satisfies Input;
export const exampleOutput = {
  allThreeArePrime: true,
  allowedTripletGapPattern: true,
  isPrimeTriplet: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/prime-triplet-checker",
  title: "Prime Triplet Checker",
  description:
    "Check supplied prime-triplet patterns (p,p+2,p+6) or (p,p+4,p+6), plus exceptional (3,5,7); not any three primes or a twin-pair alias.",
  inputs: inputFields,
  outputs: [
    { id: "allThreeArePrime", label: "All three are prime", kind: "boolean" },
    {
      id: "allowedTripletGapPattern",
      label: "Allowed triplet gap pattern",
      kind: "boolean",
    },
    { id: "isPrimeTriplet", label: "Is prime triplet", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      candidateTriplet: value.candidateTriplet as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
