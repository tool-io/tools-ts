import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^\d{4}(?:-\d{2}(?:-\d{2})?)?(?![\s\S])/.test(i.token));
  H.civil(
    i.token.length === 4
      ? i.token + "-01-01"
      : i.token.length === 7
        ? i.token + "-01"
        : i.token,
  );
  return H.finish({
    precision:
      i.token.length === 4 ? "year" : i.token.length === 7 ? "month" : "day",
  });
};
export const example = {
  input: { token: "2024-02" },
  output: { result: { precision: "month" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/iso-date-reduced-precision-label",
  title: "Date: ISO Date Reduced Precision Label Tool",
  description:
    "Classify strict Gregorian ISO reduced precision YYYY, YYYY-MM or YYYY-MM-DD without inventing omitted fields.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { precision: { type: "string" } },
        required: ["precision"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
