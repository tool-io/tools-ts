import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ electricalHigh: boolean; activeLow: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "electricalHigh", label: "Electrical high", kind: "boolean" },
  { id: "activeLow", label: "Active low", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ logicalAsserted: i.electricalHigh !== i.activeLow });
};
export const example = {
  input: { electricalHigh: false, activeLow: true },
  output: { result: { logicalAsserted: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/gpio-active-low-logical-value",
  title: "Microcontroller: GPIO Active Low Logical Value Tool",
  description:
    "Crosswalk one GPIO electrical level to asserted logical state under an explicit active-low flag; no register access or electrical-threshold inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { logicalAsserted: { type: "boolean" } },
        required: ["logicalAsserted"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
