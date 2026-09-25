import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ decimalHour: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "decimalHour", label: "Decimal hour", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.decimalHour >= 0 && i.decimalHour < 24);
  const seconds = Math.round(i.decimalHour * 3600);
  return H.finish({
    hour: Math.floor(seconds / 3600) % 24,
    minute: Math.floor(seconds / 60) % 60,
    second: seconds % 60,
    dayCarry: seconds === 86400 ? 1 : 0,
  });
};
export const example = {
  input: { decimalHour: 12.5 },
  output: { result: { hour: 12, minute: 30, second: 0, dayCarry: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/decimal-hour-civil-time-field",
  title: "Date: Decimal Hour Civil Time Field Tool",
  description:
    "Convert one nonnegative decimal civil-hour value to nearest-second fields with explicit 24-hour day carry; no timezone or fractional-day astronomical convention.",
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
          hour: { type: "number" },
          minute: { type: "number" },
          second: { type: "number" },
        },
        required: ["dayCarry", "hour", "minute", "second"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
