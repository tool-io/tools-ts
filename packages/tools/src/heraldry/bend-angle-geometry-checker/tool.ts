import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  deg,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly horizontalRun: number;
  readonly verticalRise: number;
  readonly callerReferenceAngleDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "horizontalRun", label: "Horizontal run", kind: "number" },
  { id: "verticalRise", label: "Vertical rise", kind: "number" },
  {
    id: "callerReferenceAngleDegrees",
    label: "Caller reference angle degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.horizontalRun, "horizontalRun");
  nonnegative(input.verticalRise, "verticalRise");
  const angle = deg(Math.atan2(input.verticalRise, input.horizontalRun));
  return {
    observedAngleDegrees: angle,
    signedReferenceDifferenceDegrees: angle - input.callerReferenceAngleDegrees,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    horizontalRun: 100,
    verticalRise: 100,
    callerReferenceAngleDegrees: 45,
  },
  output: {
    result: { observedAngleDegrees: 45, signedReferenceDifferenceDegrees: 0 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/bend-angle-geometry-checker",
  title: "Bend Diagonal Angle Geometry Checker (45\u00b0)",
  description:
    "Compute actual bend angle from measured orthogonal extents, not force45 degrees for nonsquare shields.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
