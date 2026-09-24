import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly actualDepth: number;
  readonly predictedDepth: number;
  readonly commonAncestorDepth: number;
};
export type Output = {
  readonly upward: number;
  readonly downward: number;
  readonly pathLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualDepth: { type: "integer", minimum: 0 },
    predictedDepth: { type: "integer", minimum: 0 },
    commonAncestorDepth: { type: "integer", minimum: 0 },
  },
  required: ["actualDepth", "predictedDepth", "commonAncestorDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upward: { type: "integer" },
    downward: { type: "integer" },
    pathLength: { type: "integer" },
  },
  required: ["upward", "downward", "pathLength"],
} as const;
/** Compute hierarchical label depth error term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { actualDepth, predictedDepth, commonAncestorDepth } = input;
  const compute = (): Output => {
    integer(actualDepth);
    integer(predictedDepth);
    integer(commonAncestorDepth, 0, Math.min(actualDepth, predictedDepth));
    const upward = actualDepth - commonAncestorDepth,
      downward = predictedDepth - commonAncestorDepth;
    return { upward, downward, pathLength: upward + downward };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { actualDepth: 4, predictedDepth: 3, commonAncestorDepth: 2 },
  output: { upward: 2, downward: 1, pathLength: 3 },
} satisfies ToolExample<Input, Output>;
export const hierarchicalLabelDepthErrorTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/hierarchical-label-depth-error-term",
  title: "Hierarchical Label Depth Error Term Tool",
  description:
    "Compute hierarchical label depth error term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "actualDepth",
        label: "Actual Depth",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "predictedDepth",
        label: "Predicted Depth",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "commonAncestorDepth",
        label: "Common Ancestor Depth",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "upward", label: "Upward", valueType: { type: "integer" } },
      { id: "downward", label: "Downward", valueType: { type: "integer" } },
      {
        id: "pathLength",
        label: "Path Length",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = hierarchicalLabelDepthErrorTermTool.execute;
export default hierarchicalLabelDepthErrorTermTool;
