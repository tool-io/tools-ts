import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; end: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "end", kind: "integer", label: "end" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bits(i.bits);
  H.int(i.end, 0, i.bits.length);
  return H.finish({
    rank: i.bits
      .slice(0, i.end)
      .split("")
      .filter((x) => x === "1").length,
  });
};
export const example = {
  input: { bits: "10100", end: 4 },
  output: { result: { rank: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-rank-one-query",
  title: "Bit String Rank One Query",
  description:
    "Count 1 bits in the half-open prefix before an explicit endpoint; rank excludes the endpoint position itself.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { rank: { type: "number" } },
        required: ["rank"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
