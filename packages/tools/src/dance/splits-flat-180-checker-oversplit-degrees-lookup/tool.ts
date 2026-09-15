import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{ readonly measuredSplitAngleDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "measuredSplitAngleDegrees",
    label: "Measured split angle degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.measuredSplitAngleDegrees, "angle", 0, 270);
  return {
    atLeastFlat180: i.measuredSplitAngleDegrees >= 180,
    oversplitDegrees: Math.max(0, i.measuredSplitAngleDegrees - 180),
    safeTrainingEstablished: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { measuredSplitAngleDegrees: 190 },
  output: {
    result: {
      atLeastFlat180: true,
      oversplitDegrees: 10,
      safeTrainingEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/splits-flat-180-checker-oversplit-degrees-lookup",
  title: "Splits Flat 180 Checker Oversplit Degrees Lookup",
  description:
    "Geometric measured split-angle comparison only, no anatomical tolerance, injury prediction or training advice.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
