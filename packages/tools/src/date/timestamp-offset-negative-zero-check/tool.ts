import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ offsetToken: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "offsetToken", label: "Offset token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)(?![\s\S])/.test(i.offsetToken));
  return H.finish({
    unknownLocalOffset: i.offsetToken === "-00:00",
    knownZeroOffset: i.offsetToken === "Z" || i.offsetToken === "+00:00",
  });
};
export const example = {
  input: { offsetToken: "-00:00" },
  output: { result: { unknownLocalOffset: true, knownZeroOffset: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/timestamp-offset-negative-zero-check",
  title: "Date: Timestamp Offset Negative Zero Check Tool",
  description:
    "Distinguish RFC3339 unknown-local-offset -00:00 from known zero offset Z/+00:00 in one validated offset token.",
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
          knownZeroOffset: { type: "boolean" },
          unknownLocalOffset: { type: "boolean" },
        },
        required: ["knownZeroOffset", "unknownLocalOffset"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
