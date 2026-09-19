import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  semiMinorMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "semiMajorMeters",
    label: "Semi major meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "semiMinorMeters",
    label: "Semi minor meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.axes(i.semiMajorMeters, i.semiMinorMeters);
  return H.finish({
    thirdFlattening:
      (i.semiMajorMeters - i.semiMinorMeters) /
      (i.semiMajorMeters + i.semiMinorMeters),
  });
};
export const example = {
  input: { semiMajorMeters: 10, semiMinorMeters: 9 },
  output: { result: { thirdFlattening: 0.05263157894736842 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/third-flattening-n-computation",
  title: "Third Flattening n Computation Calculator",
  description:
    "Compute third flattening n=(a-b)/(a+b) from matching oblate/spherical metre axes with b>=0.9a.",
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
