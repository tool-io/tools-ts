import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly radiusAMm: number;
  readonly radiusBMm: number;
  readonly centerDistanceMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "radiusAMm", label: "Radius a mm", kind: "number" },
  { id: "radiusBMm", label: "Radius b mm", kind: "number" },
  { id: "centerDistanceMm", label: "Center distance mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  [i.radiusAMm, i.radiusBMm, i.centerDistanceMm].forEach((v) =>
    nonnegative(v, "geometry"),
  );
  return {
    positiveAreaOverlap:
      i.radiusAMm > 0 &&
      i.radiusBMm > 0 &&
      i.centerDistanceMm < i.radiusAMm + i.radiusBMm,
    tangent: i.centerDistanceMm === i.radiusAMm + i.radiusBMm,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { radiusAMm: 2, radiusBMm: 3, centerDistanceMm: 4 },
  output: { result: { positiveAreaOverlap: true, tangent: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/graduated-circle-overlap-checker",
  title: "Graduated Circle Overlap Risk Radius Checker",
  description:
    "Graduated circle positive-area overlap screen from center separation; tangency reported separately.",
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
