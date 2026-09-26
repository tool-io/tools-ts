import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ fieldNumber: number; wireType: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldNumber", label: "Field number", kind: "integer" },
  { id: "wireType", label: "Wire type", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.fieldNumber, 1, 536870911);
  H.int(i.wireType, 0, 5);
  H.check(i.fieldNumber < 19000 || i.fieldNumber > 19999);
  return H.finish({ wireKey: i.fieldNumber * 8 + i.wireType });
};
export const example = {
  input: { fieldNumber: 2, wireType: 2 },
  output: { result: { wireKey: 18 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/protobuf-wire-key-scalar-fields",
  title: "Encoding: Protocol Buffers Wire Key Scalar Fields Tool",
  description:
    "Pack one Protocol Buffers field number and legal wire type into an unsigned32 key, excluding compiler-reserved field19000..19999; no message encoding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { wireKey: { type: "number" } },
        required: ["wireKey"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
