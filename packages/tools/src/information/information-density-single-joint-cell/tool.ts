import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  jointProbability: number;
  rowProbability: number;
  columnProbability: number;
  base: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "jointProbability", label: "Joint probability", kind: "number" },
  { id: "rowProbability", label: "Row probability", kind: "number" },
  { id: "columnProbability", label: "Column probability", kind: "number" },
  { id: "base", label: "Base", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.base > 1);
  [i.rowProbability, i.columnProbability].forEach((x) =>
    H.check(x > 0 && x <= 1),
  );
  H.check(
    i.jointProbability > 0 &&
      i.jointProbability <= Math.min(i.rowProbability, i.columnProbability) &&
      i.jointProbability >=
        Math.max(0, i.rowProbability + i.columnProbability - 1),
  );
  return H.finish({
    informationDensity:
      (Math.log(i.jointProbability) -
        Math.log(i.rowProbability) -
        Math.log(i.columnProbability)) /
      Math.log(i.base),
  });
};
export const example = {
  input: {
    jointProbability: 0.25,
    rowProbability: 0.5,
    columnProbability: 0.5,
    base: 2,
  },
  output: { result: { informationDensity: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/information-density-single-joint-cell",
  title: "Information: Information Density Single Joint Cell Tool",
  description:
    "Compute pointwise mutual-information density for one feasible positive joint cell and its positive marginals, not a whole-table mutual information.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { informationDensity: { type: "number" } },
        required: ["informationDensity"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
