import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  upperGravityMicrogal: number;
  lowerGravityMicrogal: number;
  heightDifferenceMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "upperGravityMicrogal",
    label: "Upper gravity microgal",
    kind: "number",
  },
  {
    id: "lowerGravityMicrogal",
    label: "Lower gravity microgal",
    kind: "number",
  },
  {
    id: "heightDifferenceMeters",
    label: "Height difference meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.heightDifferenceMeters > 0 && i.heightDifferenceMeters <= 1e4);
  H.magnitude(i.upperGravityMicrogal, 1e10);
  H.magnitude(i.lowerGravityMicrogal, 1e10);
  return H.finish({
    signedMicrogalPerMeter:
      (i.upperGravityMicrogal - i.lowerGravityMicrogal) /
      i.heightDifferenceMeters,
  });
};
export const example = {
  input: {
    upperGravityMicrogal: 100,
    lowerGravityMicrogal: 120,
    heightDifferenceMeters: 2,
  },
  output: { result: { signedMicrogalPerMeter: -10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/vertical-gradient-gravity-microgal",
  title: "Vertical Gradient of Gravity microGal per metre Calculator",
  description:
    "Compute a measured signed upward vertical gravity gradient from two same-convention observations and positive height separation; no imposed free-air gradient or terrain correction.",
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
