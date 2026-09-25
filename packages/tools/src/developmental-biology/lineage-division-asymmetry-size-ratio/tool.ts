import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly firstSize: number; readonly secondSize: number };
export type Output = {
  readonly ratio: number;
  readonly normalizedDifference: number;
  readonly firstShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSize: { type: "number", minimum: 0 },
    secondSize: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstSize", "secondSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    normalizedDifference: { type: "number" },
    firstShare: { type: "number" },
  },
  required: ["ratio", "normalizedDifference", "firstShare"],
} as const;
/** Calculate lineage division asymmetry size ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSize, secondSize } = request;
  const compute = (): Output => {
    H.domain(firstSize >= 0);
    H.positive(secondSize);
    return {
      ratio: firstSize / secondSize,
      normalizedDifference: (firstSize - secondSize) / (firstSize + secondSize),
      firstShare: firstSize / (firstSize + secondSize),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstSize: 6, secondSize: 4 },
  output: { ratio: 1.5, normalizedDifference: 0.2, firstShare: 0.6 },
} satisfies ToolExample<Input, Output>;
export const lineageDivisionAsymmetrySizeRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/lineage-division-asymmetry-size-ratio",
    title: "Lineage Division Asymmetry Size Ratio Tool",
    description:
      "Calculate lineage division asymmetry size ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSize: { type: "number", minimum: 0 },
        secondSize: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstSize", "secondSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        normalizedDifference: { type: "number" },
        firstShare: { type: "number" },
      },
      required: ["ratio", "normalizedDifference", "firstShare"],
    },
    ports: {
      inputs: [
        {
          id: "firstSize",
          label: "First Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondSize",
          label: "Second Size",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "normalizedDifference",
          label: "Normalized Difference",
          valueType: { type: "number" },
        },
        {
          id: "firstShare",
          label: "First Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lineageDivisionAsymmetrySizeRatioTool.execute;
export default lineageDivisionAsymmetrySizeRatioTool;
