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
  const p = i.jointProbability;
  H.bounded(i.rowProbability, 0, 1);
  H.bounded(i.columnProbability, 0, 1);
  H.check(
    i.base > 1 &&
      p >= Math.max(0, i.rowProbability + i.columnProbability - 1) &&
      p <= Math.min(i.rowProbability, i.columnProbability),
  );
  return H.finish({
    mutualInformationContribution:
      p === 0
        ? 0
        : (p *
            (Math.log(p) -
              Math.log(i.rowProbability) -
              Math.log(i.columnProbability))) /
          Math.log(i.base),
  });
};
export const example = {
  input: {
    jointProbability: 0.5,
    rowProbability: 0.5,
    columnProbability: 0.5,
    base: 2,
  },
  output: { result: { mutualInformationContribution: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/mutual-information-single-cell-term",
  title: "Information: Mutual Information Single Cell Term Tool",
  description:
    "Compute one probability-weighted joint-cell mutual-information contribution with feasible marginal bounds and an explicit zero-mass limit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { mutualInformationContribution: { type: "number" } },
        required: ["mutualInformationContribution"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
