import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch42-shared.js";
export type Input = Readonly<{ readonly holeCenterSpacingMm: number }>;
export type Output = Readonly<{ readonly perforationGauge: number }>;
const inputFields = [
  {
    id: "holeCenterSpacingMm",
    label: "Hole center spacing mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.holeCenterSpacingMm, "holeCenterSpacingMm");
  return { perforationGauge: 20 / input.holeCenterSpacingMm };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { holeCenterSpacingMm: 2 } satisfies Input;
export const exampleOutput = { perforationGauge: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/perf-from-hole-spacing-mm",
  title: "Perf Count from Hole Spacing mm Converter",
  description:
    "Convert measured uniform hole-center spacing to perforation gauge. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "perforationGauge", label: "Perforation gauge", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ holeCenterSpacingMm: value.holeCenterSpacingMm as number }),
});
export const run = tool.execute;
export default tool;
