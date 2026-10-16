import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ sum: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "sum", kind: "string", label: "sum" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  let sum = H.bigint(i.sum);
  H.check(sum >= 0n);
  const trace: string[] = [String(sum)];
  while (sum > 65535n) {
    sum = (sum & 65535n) + (sum >> 16n);
    trace.push(String(sum));
  }
  return H.finish({ folded: Number(sum), trace });
};
export const example = {
  input: { sum: "131071" },
  output: { result: { folded: 1, trace: ["131071", "65536", "1"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/internet-checksum-carry-fold-trace",
  title: "Internet Checksum Carry Fold Trace",
  description:
    "Trace exact Internet-checksum end-around carry folding of an unsigned integer sum without complementing it or reading packet fields.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          folded: { type: "number" },
          trace: { type: "array", items: { type: "string" } },
        },
        required: ["folded", "trace"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
