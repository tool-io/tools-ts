import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  ecefMeters: readonly number[];
  xpArcseconds: number;
  ypArcseconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ecefMeters", label: "Ecef meters", kind: "numberList", unit: "m" },
  {
    id: "xpArcseconds",
    label: "Xp arcseconds",
    kind: "number",
    unit: "arcsec",
  },
  {
    id: "ypArcseconds",
    label: "Yp arcseconds",
    kind: "number",
    unit: "arcsec",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.vector3(i.ecefMeters);
  H.check(Math.abs(i.xpArcseconds) <= 1 && Math.abs(i.ypArcseconds) <= 1);
  const [x, y, z] = i.ecefMeters,
    xp = H.rad(i.xpArcseconds / 3600),
    yp = H.rad(i.ypArcseconds / 3600);
  return H.finish({
    displacementMm: [-xp * z * 1000, yp * z * 1000, (xp * x - yp * y) * 1000],
    convention: "infinitesimal active rotation omega=(-yp,-xp,0)",
  });
};
export const example = {
  input: { ecefMeters: [1000, 0, 0], xpArcseconds: 1, ypArcseconds: 0 },
  output: {
    result: {
      displacementMm: [0, 0, 4.84813681109536],
      convention: "infinitesimal active rotation omega=(-yp,-xp,0)",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/polar-motion-components-note-generator",
  title: "Polar Motion x-y Components Displacement mm Note Generator",
  description:
    "Compute first-order Cartesian polar-motion displacement for explicitly stated rotation/sign convention from supplied xp/yp; omits s-prime, UT1, precession/nutation and full IERS frame transformation.",
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
