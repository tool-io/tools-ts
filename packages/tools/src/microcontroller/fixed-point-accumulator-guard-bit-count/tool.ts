import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ summandCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "summandCount", label: "Summand count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.summandCount, 1, 1000000000);
  return H.finish({
    guardBits: i.summandCount <= 1 ? 0 : Math.ceil(Math.log2(i.summandCount)),
  });
};
export const example = {
  input: { summandCount: 5 },
  output: { result: { guardBits: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/fixed-point-accumulator-guard-bit-count",
  title: "Microcontroller: Fixed Point Accumulator Guard Bit Count Tool",
  description:
    "Return the additional worst-case accumulation guard bits ceil(log2(N)) for a supplied positive count of same-format summands; excludes sign-format and saturation-policy design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { guardBits: { type: "number" } },
        required: ["guardBits"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
