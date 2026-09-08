import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly rayCount: number;
  readonly startAngleDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rayCount", label: "Ray count", kind: "number" },
  { id: "startAngleDegrees", label: "Start angle degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.rayCount, "rays", 1, 64);
  return {
    raySpacingDegrees: 360 / input.rayCount,
    rayAnglesDegrees: Array.from(
      { length: input.rayCount },
      (_, i) => input.startAngleDegrees + (360 * i) / input.rayCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { rayCount: 8, startAngleDegrees: 0 },
  output: {
    result: {
      raySpacingDegrees: 45,
      rayAnglesDegrees: [0, 45, 90, 135, 180, 225, 270, 315],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/sun-ray-angular-spacing",
  title: "Sun Ray Count Angular Spacing Calculator",
  description:
    "Distinct evenly spaced ideal sun-ray center directions, not duplicated360endpoint or required ray count for a named flag.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
