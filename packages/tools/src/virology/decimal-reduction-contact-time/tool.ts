import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly initialInfectiousUnits: number;
  readonly targetInfectiousUnits: number;
  readonly decimalReductionMinutes: number;
}>;
export type Output = Readonly<{
  readonly requiredLog10Reduction: number;
  readonly requiredContactMinutes: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.initialInfectiousUnits, "initialInfectiousUnits");
  positive(input.targetInfectiousUnits, "targetInfectiousUnits");
  positive(input.decimalReductionMinutes, "decimalReductionMinutes");
  if (input.targetInfectiousUnits > input.initialInfectiousUnits)
    simpleError(
      "targetInfectiousUnits",
      "Target burden cannot exceed initial burden.",
    );
  const requiredLog10Reduction =
    Math.log10(input.initialInfectiousUnits) -
    Math.log10(input.targetInfectiousUnits);
  return {
    requiredLog10Reduction,
    requiredContactMinutes:
      requiredLog10Reduction * input.decimalReductionMinutes,
  };
};
export const exampleInput = {
  initialInfectiousUnits: 1000000,
  targetInfectiousUnits: 100,
  decimalReductionMinutes: 2,
} satisfies Input;
export const exampleOutput = {
  requiredLog10Reduction: 4,
  requiredContactMinutes: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/decimal-reduction-contact-time",
  title: "Decimal Reduction Contact Time",
  description:
    "Calculate contact time for a specified viable-burden reduction using a validated constant-temperature D value; not a disinfection protocol.",
  inputs: [
    {
      id: "initialInfectiousUnits",
      label: "Initial infectious units",
      kind: "number",
    },
    {
      id: "targetInfectiousUnits",
      label: "Target infectious units",
      kind: "number",
    },
    {
      id: "decimalReductionMinutes",
      label: "Decimal reduction minutes",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "requiredLog10Reduction",
      label: "Required log 10 reduction",
      kind: "number",
    },
    {
      id: "requiredContactMinutes",
      label: "Required contact minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialInfectiousUnits: value.initialInfectiousUnits as number,
      targetInfectiousUnits: value.targetInfectiousUnits as number,
      decimalReductionMinutes: value.decimalReductionMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
