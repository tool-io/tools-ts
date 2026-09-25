import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ timeToken: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "timeToken", label: "Time token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,18}))?Z?(?![\s\S])/.exec(
    i.timeToken,
  );
  H.check(m);
  H.int(Number(m![1]), 0, 23);
  H.int(Number(m![2]), 0, 59);
  H.int(Number(m![3]), 0, 59);
  return H.finish({ fractionDigits: m![4]?.length ?? 0 });
};
export const example = {
  input: { timeToken: "12:30:45.0010Z" },
  output: { result: { fractionDigits: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/timestamp-fractional-second-digit-count",
  title: "Date: Timestamp Fractional Second Digit Count Tool",
  description:
    "Count lexical fractional-second digits in one strict HH:MM:SS[.digits][Z] token, retaining trailing zeros without timestamp conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { fractionDigits: { type: "number" } },
        required: ["fractionDigits"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
