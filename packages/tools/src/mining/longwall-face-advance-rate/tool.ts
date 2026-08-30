import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly dailyProducedTonnes: number;
  readonly faceLengthM: number;
  readonly seamHeightM: number;
  readonly coalDensityTonnesPerM3: number;
  readonly coalRecoveryFraction: number;
}>;
export type Output = Readonly<{ readonly faceAdvanceMetersPerDay: number }>;
const inputFields = [
  { id: "dailyProducedTonnes", label: "Daily produced tonnes", kind: "number" },
  { id: "faceLengthM", label: "Face length m", kind: "number" },
  { id: "seamHeightM", label: "Seam height m", kind: "number" },
  {
    id: "coalDensityTonnesPerM3",
    label: "Coal density tonnes per m3",
    kind: "number",
  },
  {
    id: "coalRecoveryFraction",
    label: "Coal recovery fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.faceLengthM, "faceLengthM");
  positive(input.seamHeightM, "seamHeightM");
  positive(input.coalDensityTonnesPerM3, "coalDensityTonnesPerM3");
  positive(input.coalRecoveryFraction, "coalRecoveryFraction");
  nonnegative(input.dailyProducedTonnes, "dailyProducedTonnes");
  fraction(input.coalRecoveryFraction, "coalRecoveryFraction");
  return {
    faceAdvanceMetersPerDay:
      input.dailyProducedTonnes /
      (input.faceLengthM *
        input.seamHeightM *
        input.coalDensityTonnesPerM3 *
        input.coalRecoveryFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyProducedTonnes: 2400,
  faceLengthM: 200,
  seamHeightM: 2,
  coalDensityTonnesPerM3: 1.5,
  coalRecoveryFraction: 0.8,
} satisfies Input;
export const exampleOutput = { faceAdvanceMetersPerDay: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/longwall-face-advance-rate",
  title: "Longwall Face Advance Rate",
  description:
    "Infer face advance from matched recovered coal tonnage and geometry; assumes undiluted production.",
  inputs: inputFields,
  outputs: [
    {
      id: "faceAdvanceMetersPerDay",
      label: "Face advance meters per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyProducedTonnes: value.dailyProducedTonnes as number,
      faceLengthM: value.faceLengthM as number,
      seamHeightM: value.seamHeightM as number,
      coalDensityTonnesPerM3: value.coalDensityTonnesPerM3 as number,
      coalRecoveryFraction: value.coalRecoveryFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
