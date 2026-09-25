import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ mask: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "Mask", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.mask, 0, 127);
  return H.finish({
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].filter(
      (_, j) => Math.floor(i.mask / 2 ** j) % 2 === 1,
    ),
  });
};
export const example = {
  input: { mask: 65 },
  output: { result: { weekdays: ["Mon", "Sun"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/weekday-mask-bitset-label",
  title: "Date: Weekday Mask Bitset Label Tool",
  description:
    "Decode a seven-bit weekday mask with Monday as bit zero, returning ordered labels and no scheduling assumptions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { weekdays: { type: "array", items: { type: "string" } } },
        required: ["weekdays"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
