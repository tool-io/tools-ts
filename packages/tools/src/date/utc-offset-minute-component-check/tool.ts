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
  const m = /^([+-])([01]\d|2[0-3]):([0-5]\d)(?![\s\S])/.exec(i.offsetToken);
  H.check(m);
  return H.finish({
    offsetMinutes:
      (m![1] === "-" ? -1 : 1) * (Number(m![2]) * 60 + Number(m![3])),
    negativeZeroUnknown: i.offsetToken === "-00:00",
  });
};
export const example = {
  input: { offsetToken: "-05:30" },
  output: { result: { offsetMinutes: -330, negativeZeroUnknown: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/utc-offset-minute-component-check",
  title: "Date: Utc Offset Minute Component Check Tool",
  description:
    "Parse a restricted signed HH:MM UTC offset with minute validation and explicit -00:00 unknown-local-offset evidence; no timezone database.",
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
          negativeZeroUnknown: { type: "boolean" },
          offsetMinutes: { type: "number" },
        },
        required: ["negativeZeroUnknown", "offsetMinutes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
