import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  rmse: number;
  reference: string;
  referenceValues: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rmse", label: "Rmse", kind: "number" },
  {
    id: "reference",
    label: "Reference",
    kind: "string",
    enum: ["range", "absolute-mean"],
  },
  { id: "referenceValues", label: "Reference values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.rmse >= 0 && i.referenceValues.length > 0);
  H.choice(i.reference, ["range", "absolute-mean"]);
  const scale =
    i.reference === "range"
      ? Math.max(...i.referenceValues) - Math.min(...i.referenceValues)
      : Math.abs(
          i.referenceValues.reduce((s, x) => s + x, 0) /
            i.referenceValues.length,
        );
  H.positive(scale);
  return H.finish({ scale, normalizedRmse: i.rmse / scale });
};
export const example = {
  input: { rmse: 2, reference: "range", referenceValues: [2, 6] },
  output: { result: { scale: 4, normalizedRmse: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/nrmse-reference-scale-choice",
  title: "Metrics: Nrmse Reference Scale Choice Tool",
  description:
    "Normalize a supplied nonnegative RMSE by explicitly selected reference range or absolute arithmetic mean; zero scale is rejected and no population reference inferred.",
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
          normalizedRmse: { type: "number" },
          scale: { type: "number" },
        },
        required: ["normalizedRmse", "scale"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
