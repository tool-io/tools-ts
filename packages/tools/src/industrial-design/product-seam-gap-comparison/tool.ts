import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMeasuredGap: number;
  readonly secondMeasuredGap: number;
  readonly suppliedTolerance: number;
};
export type Output = {
  readonly secondMinusFirst: number;
  readonly withinSuppliedDifference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMeasuredGap: { type: "number", minimum: 0 },
    secondMeasuredGap: { type: "number", minimum: 0 },
    suppliedTolerance: { type: "number", minimum: 0 },
  },
  required: ["firstMeasuredGap", "secondMeasuredGap", "suppliedTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondMinusFirst: { type: "number" },
    withinSuppliedDifference: { type: "boolean" },
  },
  required: ["secondMinusFirst", "withinSuppliedDifference"],
} as const;
/** Compare explicit product seam gaps under a supplied absolute-difference tolerance without assessing product quality standards. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMeasuredGap, secondMeasuredGap, suppliedTolerance } = request;
  const compute = (): Output => {
    H.domain(
      firstMeasuredGap >= 0 && secondMeasuredGap >= 0 && suppliedTolerance >= 0,
      "firstMeasuredGap",
    );
    return {
      secondMinusFirst: secondMeasuredGap - firstMeasuredGap,
      withinSuppliedDifference:
        Math.abs(secondMeasuredGap - firstMeasuredGap) <= suppliedTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMeasuredGap: 2,
    secondMeasuredGap: 2.5,
    suppliedTolerance: 0.6,
  },
  output: { secondMinusFirst: 0.5, withinSuppliedDifference: true },
} satisfies ToolExample<Input, Output>;
export const productSeamGapComparisonTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/product-seam-gap-comparison",
    title: "Product Seam Gap Comparison",
    description:
      "Compare explicit product seam gaps under a supplied absolute-difference tolerance without assessing product quality standards.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMeasuredGap: { type: "number", minimum: 0 },
        secondMeasuredGap: { type: "number", minimum: 0 },
        suppliedTolerance: { type: "number", minimum: 0 },
      },
      required: ["firstMeasuredGap", "secondMeasuredGap", "suppliedTolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondMinusFirst: { type: "number" },
        withinSuppliedDifference: { type: "boolean" },
      },
      required: ["secondMinusFirst", "withinSuppliedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstMeasuredGap",
          label: "First Measured Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMeasuredGap",
          label: "Second Measured Gap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTolerance",
          label: "Supplied Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "secondMinusFirst",
          label: "Second Minus First",
          valueType: { type: "number" },
        },
        {
          id: "withinSuppliedDifference",
          label: "Within Supplied Difference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = productSeamGapComparisonTool.execute;
export default productSeamGapComparisonTool;
