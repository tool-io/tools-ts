import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const valid: number[] = [],
    invalid: number[] = [];
  for (let j = 0; j < i.text.length; j++)
    if (i.text[j] === "%") {
      if (/^[0-9A-Fa-f]{2}/.test(i.text.slice(j + 1))) {
        valid.push(j);
        j += 2;
      } else invalid.push(j);
    }
  return H.finish({
    validTripletOffsets: valid,
    invalidPercentOffsets: invalid,
  });
};
export const example = {
  input: { text: "a%20%GG%" },
  output: {
    result: { validTripletOffsets: [1], invalidPercentOffsets: [4, 7] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/uri-percent-triplet-position",
  title: "Parsing: URI Percent Triplet Position Tool",
  description:
    "Locate percent signs that begin valid two-hex-digit URI octet escapes and invalid percent positions using UTF-16 offsets; does not decode or normalize a URI.",
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
          invalidPercentOffsets: { type: "array", items: { type: "number" } },
          validTripletOffsets: { type: "array", items: { type: "number" } },
        },
        required: ["invalidPercentOffsets", "validTripletOffsets"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
