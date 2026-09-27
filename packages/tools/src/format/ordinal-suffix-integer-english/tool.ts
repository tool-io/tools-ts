import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ integer: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "integer", label: "Integer", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.big(i.integer),
    n = v < 0n ? -v : v,
    r = Number(n % 100n);
  return H.finish({
    suffix:
      r >= 11 && r <= 13
        ? "th"
        : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[
            Number(n % 10n)
          ] ?? "th"),
  });
};
export const example = {
  input: { integer: "112" },
  output: { result: { suffix: "th" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/ordinal-suffix-integer-english",
  title: "Formatting: Ordinal Suffix Integer English Tool",
  description:
    "Return only the English ordinal suffix of an exact signed decimal integer, treating the absolute ending and the 11/12/13 exception.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { suffix: { type: "string" } },
        required: ["suffix"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
