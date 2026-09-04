import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch39-shared.js";
export type Input = Readonly<{ readonly verticalHandHeightCm: number }>;
export type Output = Readonly<{ readonly verticalMultiplier: number }>;
const inputFields = [
  {
    id: "verticalHandHeightCm",
    label: "Vertical hand height cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.verticalHandHeightCm < 0 || input.verticalHandHeightCm > 175)
    simpleError("V", "RNLE0≤V≤175cm.");
  return {
    verticalMultiplier: 1 - 0.003 * Math.abs(input.verticalHandHeightCm - 75),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { verticalHandHeightCm: 100 } satisfies Input;
export const exampleOutput = { verticalMultiplier: 0.925 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/niosh-vertical-multiplier",
  title: "NIOSH Vertical Multiplier Lookup",
  description:
    "RNLE vertical hand-height multiplier1−.003|V−75|, actual hand height not stature/desk height. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "verticalMultiplier", label: "Vertical multiplier", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ verticalHandHeightCm: value.verticalHandHeightCm as number }),
});
export const run = tool.execute;
export default tool;
