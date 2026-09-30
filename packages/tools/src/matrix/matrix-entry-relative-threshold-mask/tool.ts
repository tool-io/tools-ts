import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  entry: number;
  referenceMagnitude: number;
  relativeTolerance: number;
  absoluteTolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "entry", label: "Entry", kind: "number" },
  { id: "referenceMagnitude", label: "Reference magnitude", kind: "number" },
  { id: "relativeTolerance", label: "Relative tolerance", kind: "number" },
  { id: "absoluteTolerance", label: "Absolute tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.referenceMagnitude >= 0 &&
      i.relativeTolerance >= 0 &&
      i.absoluteTolerance >= 0,
  );
  const threshold =
    i.absoluteTolerance + i.relativeTolerance * i.referenceMagnitude;
  return H.finish({ threshold, negligible: Math.abs(i.entry) <= threshold });
};
export const example = {
  input: {
    entry: 0.03,
    referenceMagnitude: 2,
    relativeTolerance: 0.01,
    absoluteTolerance: 0.01,
  },
  output: { result: { threshold: 0.03, negligible: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "matrix/matrix-entry-relative-threshold-mask",
  title: "Matrix: Matrix Entry Relative Threshold Mask Tool",
  description:
    "Classify one matrix entry under an explicit absTol+relTol*reference threshold, not a global rank or sparsity decision.",
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
          negligible: { type: "boolean" },
          threshold: { type: "number" },
        },
        required: ["negligible", "threshold"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
