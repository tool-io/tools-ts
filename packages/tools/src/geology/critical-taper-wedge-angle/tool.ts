import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSurfaceSlopeDegrees: number;
  readonly actualBasalDipDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSurfaceSlopeDegrees",
    label: "Actual surface slope degrees",
    kind: "number",
  },
  {
    id: "actualBasalDipDegrees",
    label: "Actual basal dip degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    Math.abs(input.actualSurfaceSlopeDegrees) >= 90 ||
    Math.abs(input.actualBasalDipDegrees) >= 90 ||
    Math.abs(input.actualSurfaceSlopeDegrees + input.actualBasalDipDegrees) >=
      90
  )
    simpleError("angle", "Actual declared geometric branch within±90°.");
  return {
    observedWedgeTaperDegrees:
      input.actualSurfaceSlopeDegrees + input.actualBasalDipDegrees,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSurfaceSlopeDegrees: 5, actualBasalDipDegrees: 3 },
  output: { result: { observedWedgeTaperDegrees: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/critical-taper-wedge-angle",
  title: "Geology Critical Taper Wedge Angle Calculator",
  description:
    "Observed wedge taper\u03b1+\u03b2under actual signed dip convention. This does NOT derive critical Coulombtaper from pore pressure/friction, or demonstrate critical state, tectonic activity or stability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
