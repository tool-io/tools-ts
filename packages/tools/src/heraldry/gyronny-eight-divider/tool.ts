import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch43-shared.js";

export type Input = Readonly<{ readonly startAngleDegrees: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "startAngleDegrees", label: "Start angle degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    boundaryAnglesDegrees: Array.from(
      { length: 9 },
      (_, i) => input.startAngleDegrees + 45 * i,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { startAngleDegrees: 0 },
  output: {
    result: {
      boundaryAnglesDegrees: [0, 45, 90, 135, 180, 225, 270, 315, 360],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/gyronny-eight-divider",
  title: "Gyronny Eight-Section Angular Divider",
  description:
    "Eight ideal gyronny centerline angular sectors; unclipped rays relative to caller explicit angular origin, not curved-shield equal areas.",
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
