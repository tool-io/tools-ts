import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ triplet: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "triplet", label: "Triplet", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^%[0-9A-Fa-f]{2}(?![\s\S])/.test(i.triplet));
  return H.finish({ octet: parseInt(i.triplet.slice(1), 16) });
};
export const example = {
  input: { triplet: "%FF" },
  output: { result: { octet: 255 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/percent-encoded-octet-triplet",
  title: "Decoding: Percent Encoded Octet Triplet Tool",
  description:
    "Decode exactly one percent-encoded octet without interpreting it as UTF-8 text or a URL.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { octet: { type: "number" } },
        required: ["octet"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
