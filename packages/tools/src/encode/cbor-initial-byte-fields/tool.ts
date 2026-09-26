import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  majorType: number;
  additionalInformation: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "majorType", label: "Major type", kind: "integer" },
  {
    id: "additionalInformation",
    label: "Additional information",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.majorType, 0, 7);
  H.int(i.additionalInformation, 0, 31);
  H.check(i.additionalInformation < 28 || i.additionalInformation === 31);
  return H.finish({ initialByte: i.majorType * 32 + i.additionalInformation });
};
export const example = {
  input: { majorType: 5, additionalInformation: 1 },
  output: { result: { initialByte: 161 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/cbor-initial-byte-fields",
  title: "Encoding: CBOR Initial Byte Fields Tool",
  description:
    "Pack a CBOR initial byte from explicitly supplied major type and nonreserved additional-information fields; excludes subsequent data and semantic indefinite-length validation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { initialByte: { type: "number" } },
        required: ["initialByte"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
