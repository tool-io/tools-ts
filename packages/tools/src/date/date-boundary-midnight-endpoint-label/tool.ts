import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ timeToken: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "timeToken", label: "Time token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^(?:[01]\d|2[0-3]):[0-5]\d(?![\s\S])/.test(i.timeToken) ||
      i.timeToken === "24:00",
  );
  return H.finish({
    midnight: i.timeToken === "00:00" || i.timeToken === "24:00",
    dayCarry: i.timeToken === "24:00" ? 1 : 0,
    normalizedTime: i.timeToken === "24:00" ? "00:00" : i.timeToken,
  });
};
export const example = {
  input: { timeToken: "24:00" },
  output: { result: { midnight: true, dayCarry: 1, normalizedTime: "00:00" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/date-boundary-midnight-endpoint-label",
  title: "Date: Date Boundary Midnight Endpoint Label Tool",
  description:
    "Distinguish the interval-end spelling 24:00 from start-of-day 00:00, retaining day carry instead of silently treating both as one instant.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dayCarry: { type: "number" },
          midnight: { type: "boolean" },
          normalizedTime: { type: "string" },
        },
        required: ["dayCarry", "midnight", "normalizedTime"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
