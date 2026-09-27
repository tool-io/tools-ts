import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ hour: number; minute: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hour", label: "Hour", kind: "integer" },
  { id: "minute", label: "Minute", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.hour, 0, 23);
  H.int(i.minute, 0, 59);
  const branchIndex = Math.floor(((i.hour + 1) % 24) / 2);
  return H.finish({
    branchIndex,
    startHour: H.mod(2 * branchIndex - 1, 24),
    endHour: 2 * branchIndex + 1,
    crossesMidnight: branchIndex === 0,
  });
};
export const example = {
  input: { hour: 23, minute: 30 },
  output: {
    result: {
      branchIndex: 0,
      startHour: 23,
      endHour: 1,
      crossesMidnight: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ganzhi/shichen-from-clock",
  title: "Shichen Double-Hour Calculator",
  description:
    "Map explicit local clock time to half-open traditional double hours, with Zi spanning 23:00 to 01:00; no solar-time or timezone correction.",
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
          branchIndex: { type: "number" },
          crossesMidnight: { type: "boolean" },
          endHour: { type: "number" },
          startHour: { type: "number" },
        },
        required: ["branchIndex", "crossesMidnight", "endHour", "startHour"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
