import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  rad,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly latitudeDegrees: number;
  readonly earthRadiusM: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
  { id: "earthRadiusM", label: "Earth radius m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.latitudeDegrees, "latitude", -90, 90);
  positive(i.earthRadiusM, "radius");
  return {
    betaPerMeterSecond:
      (2 * 7.292115e-5 * Math.cos(rad(i.latitudeDegrees))) / i.earthRadiusM,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { latitudeDegrees: 0, earthRadiusM: 6371000 },
  output: { result: { betaPerMeterSecond: 2.2891586878041123e-11 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/beta-plane-parameter-change",
  title: "Beta Plane Parameter Change Calculator",
  description:
    "Local beta=df/dy spherical Earth approximation in m^-1 s^-1; no beta-plane validity guarantee.",
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
