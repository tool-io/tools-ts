import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  eyeHeightMeters: number;
  earthRadiusMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "eyeHeightMeters",
    label: "Eye height meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "earthRadiusMeters",
    label: "Earth radius meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.eyeHeightMeters >= 0 &&
      i.eyeHeightMeters <= 1e5 &&
      i.earthRadiusMeters >= 1e6 &&
      i.earthRadiusMeters <= 1e7,
  );
  return H.finish({
    geometricDipDegrees: H.deg(
      Math.atan2(
        Math.sqrt(
          i.eyeHeightMeters * (2 * i.earthRadiusMeters + i.eyeHeightMeters),
        ),
        i.earthRadiusMeters,
      ),
    ),
  });
};
export const example = {
  input: { eyeHeightMeters: 0, earthRadiusMeters: 6371000 },
  output: { result: { geometricDipDegrees: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/horizon-dip-eye-height-calculator",
  title: "Horizon Dip Angle from Eye Height Calculator",
  description:
    "Compute exact geometric spherical horizon dip from eye height and radius, excluding atmospheric refraction; distinct from refracted nautical empirical dip corrections.",
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
