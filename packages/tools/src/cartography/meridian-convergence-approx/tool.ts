import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rad, deg, angle } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly latitudeDegrees: number;
  readonly longitudeDifferenceDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
  {
    id: "longitudeDifferenceDegrees",
    label: "Longitude difference degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.latitudeDegrees, "latitude", -80, 84);
  angle(i.longitudeDifferenceDegrees, "longitude offset", -6, 6);
  return {
    approximateConvergenceDegrees: deg(
      Math.atan(
        Math.tan(rad(i.longitudeDifferenceDegrees)) *
          Math.sin(rad(i.latitudeDegrees)),
      ),
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { latitudeDegrees: 30, longitudeDifferenceDegrees: 0 },
  output: { result: { approximateConvergenceDegrees: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/meridian-convergence-approx",
  title: "Convergence of Meridians Approximation Calculator",
  description:
    "Spherical transverse-Mercator meridian convergence approximation for |longitude offset|<=6 degrees; not ellipsoidal survey correction.",
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
