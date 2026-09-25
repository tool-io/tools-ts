import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ signedValue: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "signedValue", label: "Signed value", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.signedValue, -1000000000, 1000000000);
  const n = BigInt(i.signedValue);
  return H.finish({
    folded: String(2n * (n < 0n ? -n : n) + (n < 0n ? 1n : 0n)),
  });
};
export const example = {
  input: { signedValue: -3 },
  output: { result: { folded: "7" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/source-map-base64-vlq-sign-fold",
  title: "Development: Source Map Base64 Vlq Sign Fold Tool",
  description:
    "Fold one signed integer to the source-map VLQ sign-in-low-bit representation, not protobuf ZigZag and not a complete Base64 VLQ encoder.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { folded: { type: "string" } },
        required: ["folded"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
