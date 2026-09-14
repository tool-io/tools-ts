import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  rad,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly latitudeDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.latitudeDegrees, "latitude", -90, 90);
  if (i.latitudeDegrees === 0) simpleError("latitude", "Nonzero f.");
  return {
    periodSeconds:
      (2 * Math.PI) /
      Math.abs(2 * 7.292115e-5 * Math.sin(rad(i.latitudeDegrees))),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { latitudeDegrees: 30 },
  output: { result: { periodSeconds: 86164.10063718943 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/inertial-period-f-latitude",
  title: "Inertial Period F Latitude Calculator",
  description:
    "Ideal f-plane inertial period in seconds; signed hemisphere does not change period, equator rejected.",
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
