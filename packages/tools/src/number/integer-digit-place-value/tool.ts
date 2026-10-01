import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ integer: string; place: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "integer", label: "Integer", kind: "string" },
  { id: "place", label: "Place", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const n = H.big(i.integer),
    s = String(n < 0n ? -n : n);
  H.int(i.place, 0, 127);
  const digit = Number(s[s.length - 1 - i.place] ?? "0");
  return H.finish({
    digit,
    placeValue: String(BigInt(digit) * 10n ** BigInt(i.place)),
    negative: n < 0n,
  });
};
export const example = {
  input: { integer: "-1234", place: 2 },
  output: { result: { digit: 2, placeValue: "200", negative: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/integer-digit-place-value",
  title: "Number: Integer Digit Place Value Tool",
  description:
    "Extract an exact base-ten digit and unsigned place-value contribution from a signed integer, counting places from zero at units.",
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
          digit: { type: "number" },
          negative: { type: "boolean" },
          placeValue: { type: "string" },
        },
        required: ["digit", "negative", "placeValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
