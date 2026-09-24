import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ word: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", label: "Word", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[UD]*(?![\s\S])/.test(i.word));
  let balance = 0,
    minimum = 0;
  for (const c of i.word) {
    balance += c === "U" ? 1 : -1;
    minimum = Math.min(minimum, balance);
  }
  return H.finish({
    finalBalance: balance,
    minimumPrefixBalance: minimum,
    dyck: balance === 0 && minimum >= 0,
  });
};
export const example = {
  input: { word: "UUDD" },
  output: { result: { finalBalance: 0, minimumPrefixBalance: 0, dyck: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/dyck-word-up-down-balance",
  title: "Combinatorics: Dyck Word Up Down Balance Tool",
  description:
    "Check one bounded up/down word for Dyck prefix nonnegativity and final balance, retaining a negative prefix witness rather than merely equal counts.",
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
          dyck: { type: "boolean" },
          finalBalance: { type: "number" },
          minimumPrefixBalance: { type: "number" },
        },
        required: ["dyck", "finalBalance", "minimumPrefixBalance"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
