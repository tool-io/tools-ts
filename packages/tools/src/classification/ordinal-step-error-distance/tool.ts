import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  actualIndex: number;
  predictedIndex: number;
  classCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualIndex", label: "Actual index", kind: "integer" },
  { id: "predictedIndex", label: "Predicted index", kind: "integer" },
  { id: "classCount", label: "Class count", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.classCount, 1, 1000000);
  H.int(i.actualIndex, 0, i.classCount - 1);
  H.int(i.predictedIndex, 0, i.classCount - 1);
  return H.finish({
    signedSteps: i.predictedIndex - i.actualIndex,
    absoluteSteps: Math.abs(i.predictedIndex - i.actualIndex),
  });
};
export const example = {
  input: { actualIndex: 1, predictedIndex: 3, classCount: 4 },
  output: { result: { signedSteps: 2, absoluteSteps: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/ordinal-step-error-distance",
  title: "Classification: Ordinal Step Error Distance Tool",
  description:
    "Measure signed and absolute ordinal class-index error under an explicitly supplied ordered class count.",
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
          absoluteSteps: { type: "number" },
          signedSteps: { type: "number" },
        },
        required: ["absoluteSteps", "signedSteps"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
