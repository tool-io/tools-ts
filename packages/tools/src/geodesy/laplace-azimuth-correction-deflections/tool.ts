import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  latitudeDegrees: number;
  etaArcseconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "etaArcseconds",
    label: "Eta arcseconds",
    kind: "number",
    unit: "arcsec",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const phi = H.latitude(i.latitudeDegrees, false);
  H.check(Math.abs(i.etaArcseconds) <= 300);
  return H.finish({
    azimuthCorrectionArcseconds: i.etaArcseconds * Math.tan(phi),
  });
};
export const example = {
  input: { latitudeDegrees: 45, etaArcseconds: 1 },
  output: { result: { azimuthCorrectionArcseconds: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/laplace-azimuth-correction-deflections",
  title: "Laplace Equation Azimuth Correction from Deflections Calculator",
  description:
    "Compute the Laplace azimuth difference astronomical-minus-geodetic = eta*tan(geodetic latitude), using east-positive eta; excludes poles and higher-order deflection effects.",
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
