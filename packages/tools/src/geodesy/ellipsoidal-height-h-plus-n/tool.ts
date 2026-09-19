import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  orthometricHeightMeters: number;
  geoidUndulationMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "orthometricHeightMeters",
    label: "Orthometric height meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "geoidUndulationMeters",
    label: "Geoid undulation meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(Object.values(i).every((x) => Math.abs(x) <= 1e7));
  return H.finish({
    ellipsoidalHeightMeters:
      i.orthometricHeightMeters + i.geoidUndulationMeters,
  });
};
export const example = {
  input: { orthometricHeightMeters: 100, geoidUndulationMeters: 20 },
  output: { result: { ellipsoidalHeightMeters: 120 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/ellipsoidal-height-h-plus-n",
  title: "Ellipsoidal Height h from H plus N Calculator",
  description:
    "Apply the physical height relation h=H+N with explicit matching vertical datum/tide-system geoid undulation N; no geoid lookup or automatic vertical-datum transformation.",
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
