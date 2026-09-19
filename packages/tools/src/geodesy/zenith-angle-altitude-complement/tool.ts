import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ altitudeDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "altitudeDegrees",
    label: "Altitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.latitude(i.altitudeDegrees);
  return H.finish({ zenithDegrees: 90 - i.altitudeDegrees });
};
export const example = {
  input: { altitudeDegrees: -10 },
  output: { result: { zenithDegrees: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/zenith-angle-altitude-complement",
  title: "Zenith Angle from Altitude Complement Calculator",
  description:
    "Convert signed horizon altitude in [-90,90] degrees to zenith angle [0,180] degrees; same apparent/geometric convention must be retained.",
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
