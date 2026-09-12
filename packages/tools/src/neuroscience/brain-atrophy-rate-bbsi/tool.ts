import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentBbsiVolumeLoss: number;
  readonly actualIndependentBaselineBrainVolume: number;
  readonly actualElapsedYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentBbsiVolumeLoss",
    label: "Actual independent bbsi volume loss",
    kind: "number",
  },
  {
    id: "actualIndependentBaselineBrainVolume",
    label: "Actual independent baseline brain volume",
    kind: "number",
  },
  { id: "actualElapsedYears", label: "Actual elapsed years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualIndependentBaselineBrainVolume,
    "actualIndependentBaselineBrainVolume",
  );
  positive(input.actualElapsedYears, "actualElapsedYears");
  return {
    value:
      (100 * input.actualIndependentBbsiVolumeLoss) /
      input.actualIndependentBaselineBrainVolume /
      input.actualElapsedYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentBbsiVolumeLoss: 2,
    actualIndependentBaselineBrainVolume: 100,
    actualElapsedYears: 2,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/brain-atrophy-rate-bbsi",
  title: "BBSI Brain Atrophy Rate Calculator",
  description:
    "Actual independently BBSI estimated signed volume loss/baseline/years annual percent. Does not perform boundary integral registration, or equate with SIENAPBVC method. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
