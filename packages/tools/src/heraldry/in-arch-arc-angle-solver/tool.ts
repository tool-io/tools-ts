import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly chargeCount: number;
  readonly startAngleDegrees: number;
  readonly arcSpanDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "chargeCount", label: "Charge count", kind: "number" },
  { id: "startAngleDegrees", label: "Start angle degrees", kind: "number" },
  { id: "arcSpanDegrees", label: "Arc span degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.chargeCount, "count", 2, 64);
  if (input.arcSpanDegrees < 0 || input.arcSpanDegrees > 360)
    simpleError("arc", "0–360 degrees explicit oriented arc.");
  return {
    placementAngles: Array.from(
      { length: input.chargeCount },
      (_, i) =>
        input.startAngleDegrees +
        (input.arcSpanDegrees * i) / (input.chargeCount - 1),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { chargeCount: 3, startAngleDegrees: 0, arcSpanDegrees: 180 },
  output: { result: { placementAngles: [0, 90, 180] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/in-arch-arc-angle-solver",
  title: "In Arch Arc Placement Angle Solver",
  description:
    "Endpoint-inclusive ideal arc charge angles; a full turn duplicates endpoint positions, explicitly not a distinct circle inventory.",
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
