import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ parts: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parts", label: "Parts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.parts.every(
      (x, j) => Number.isSafeInteger(x) && x > 0 && (!j || x <= i.parts[j - 1]),
    ),
  );
  return H.finish({ durfeeSize: i.parts.filter((v, j) => v >= j + 1).length });
};
export const example = {
  input: { parts: [4, 3, 1] },
  output: { result: { durfeeSize: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/integer-partition-durfee-size",
  title: "Combinatorics: Integer Partition Durfee Size Tool",
  description:
    "Compute the Durfee-square side of one descending integer partition, not a partition-number solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { durfeeSize: { type: "number" } },
        required: ["durfeeSize"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
