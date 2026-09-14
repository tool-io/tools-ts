import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch52-shared.js";
export type Input = Readonly<{ readonly azimuthDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "azimuthDegrees", label: "Azimuth degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return { validAzimuth: i.azimuthDegrees >= 0 && i.azimuthDegrees < 360 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { azimuthDegrees: 315 },
  output: { result: { validAzimuth: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/hillshade-azimuth-validator",
  title: "Hillshade Azimuth Angle Input Validator",
  description:
    "Validate finite hillshade azimuth in [0,360) degrees clockwise from north; invalid finite angles return false.",
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
