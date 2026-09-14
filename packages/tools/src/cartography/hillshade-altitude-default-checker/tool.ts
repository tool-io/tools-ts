import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{ readonly altitudeDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "altitudeDegrees", label: "Altitude degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.altitudeDegrees, "altitude", 0, 90);
  return { matchesIllustrativeDefault45: i.altitudeDegrees === 45 };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { altitudeDegrees: 45 },
  output: { result: { matchesIllustrativeDefault45: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/hillshade-altitude-default-checker",
  title: "Hillshade Altitude Angle Default 45 Checker",
  description:
    "Compare valid illumination altitude with illustrative 45-degree convention, not an implementation-wide default.",
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
