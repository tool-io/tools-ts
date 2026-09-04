import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch39-shared.js";
export type Input = Readonly<{ readonly horizontalReachCm: number }>;
export type Output = Readonly<{ readonly horizontalMultiplier: number }>;
const inputFields = [
  { id: "horizontalReachCm", label: "Horizontal reach cm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.horizontalReachCm < 0 || input.horizontalReachCm > 63)
    simpleError("H", "H≤63cm eligible horizontal domain, H<25clamped to 25.");
  return { horizontalMultiplier: 25 / Math.max(25, input.horizontalReachCm) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { horizontalReachCm: 50 } satisfies Input;
export const exampleOutput = { horizontalMultiplier: 0.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/niosh-horizontal-multiplier",
  title: "NIOSH Horizontal Multiplier Lookup",
  description:
    "RNLE horizontal multiplier25/max(25, H), reject beyond 63cm rather than assert applicable lifting model. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "horizontalMultiplier",
      label: "Horizontal multiplier",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ horizontalReachCm: value.horizontalReachCm as number }),
});
export const run = tool.execute;
export default tool;
