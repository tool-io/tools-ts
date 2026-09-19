import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ horizontalDistanceKm: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "horizontalDistanceKm",
    label: "Horizontal distance km",
    kind: "number",
    unit: "km",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.horizontalDistanceKm >= 0 && i.horizontalDistanceKm <= 100);
  return H.finish({
    combinedCorrectionMeters: 0.0675 * i.horizontalDistanceKm ** 2,
  });
};
export const example = {
  input: { horizontalDistanceKm: 2 },
  output: { result: { combinedCorrectionMeters: 0.27 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/curvature-refraction-combined-00675d2",
  title:
    "Combined Curvature and Refraction Correction c=0.0675d\u00b2 Calculator",
  description:
    "Evaluate the explicitly named historical combined curvature/refraction approximation 0.0675*dKm^2 metres; fixed conventional coefficient, not measured refraction or an exact universal Earth model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
