import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  simpleError,
  rad,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly speedMPerS: number;
  readonly latitudeDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "speedMPerS", label: "Speed m per s", kind: "number" },
  { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.speedMPerS, "speed");
  angle(i.latitudeDegrees, "latitude", -90, 90);
  if (i.latitudeDegrees === 0)
    simpleError("latitude", "Nonzero latitude/f required.");
  return {
    radiusM:
      i.speedMPerS /
      Math.abs(2 * 7.292115e-5 * Math.sin(rad(i.latitudeDegrees))),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { speedMPerS: 1, latitudeDegrees: 30 },
  output: { result: { radiusM: 13713.442533476227 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/inertial-circle-radius-latitude",
  title: "Inertial Circle Radius Latitude Calculator",
  description:
    "Ideal f-plane inertial circle radius; equatorial f=0 rejected, not actual drifter prediction.",
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
