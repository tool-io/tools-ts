import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSiienaSignedPercentageBrainVolumeChange: number;
  readonly actualElapsedYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSiienaSignedPercentageBrainVolumeChange",
    label: "Actual siiena signed percentage brain volume change",
    kind: "number",
  },
  { id: "actualElapsedYears", label: "Actual elapsed years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualElapsedYears, "actualElapsedYears");
  return {
    value:
      -input.actualSiienaSignedPercentageBrainVolumeChange /
      input.actualElapsedYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSiienaSignedPercentageBrainVolumeChange: -2,
    actualElapsedYears: 2,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/brain-atrophy-rate-siiena",
  title: "SIENA Brain Atrophy Rate Calculator",
  description:
    "Actual independently SIENA processed PBVC annual arithmetic loss positive=\u2212PBVC/years. Does not run SIENA registration/segmentation or compound volume endpoint ratio. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
