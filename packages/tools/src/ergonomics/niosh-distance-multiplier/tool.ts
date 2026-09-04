import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch39-shared.js";
export type Input = Readonly<{ readonly verticalTravelCm: number }>;
export type Output = Readonly<{ readonly distanceMultiplier: number }>;
const inputFields = [
  { id: "verticalTravelCm", label: "Vertical travel cm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.verticalTravelCm < 0 || input.verticalTravelCm > 175)
    simpleError("D", "RNLE0≤D≤175cm, below25clamped25.");
  return {
    distanceMultiplier: 0.82 + 4.5 / Math.max(25, input.verticalTravelCm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { verticalTravelCm: 50 } satisfies Input;
export const exampleOutput = { distanceMultiplier: 0.91 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/niosh-distance-multiplier",
  title: "NIOSH Distance Multiplier Lookup",
  description:
    "RNLE vertical travel multiplier.82+4.5/max(25, D), not vertical hand-height multiplier. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "distanceMultiplier", label: "Distance multiplier", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ verticalTravelCm: value.verticalTravelCm as number }),
});
export const run = tool.execute;
export default tool;
