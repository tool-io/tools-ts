import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sensitivity: number;
  readonly halfTolerance: number;
};
export type Output = {
  readonly worstCaseContribution: number;
  readonly squaredRssContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sensitivity: { type: "number" },
    halfTolerance: { type: "number", minimum: 0 },
  },
  required: ["sensitivity", "halfTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    worstCaseContribution: { type: "number" },
    squaredRssContribution: { type: "number" },
  },
  required: ["worstCaseContribution", "squaredRssContribution"],
} as const;
/** Calculate product stackup one tolerance contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sensitivity, halfTolerance } = request;
  const compute = (): Output => {
    H.domain(halfTolerance >= 0);
    return {
      worstCaseContribution: Math.abs(sensitivity) * halfTolerance,
      squaredRssContribution: (sensitivity * halfTolerance) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sensitivity: 2, halfTolerance: 0.1 },
  output: {
    worstCaseContribution: 0.2,
    squaredRssContribution: 0.04000000000000001,
  },
} satisfies ToolExample<Input, Output>;
export const productStackupOneToleranceContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-design/product-stackup-one-tolerance-contribution",
      title: "Product Stackup One Tolerance Contribution Tool",
      description:
        "Calculate product stackup one tolerance contribution from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sensitivity: { type: "number" },
          halfTolerance: { type: "number", minimum: 0 },
        },
        required: ["sensitivity", "halfTolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          worstCaseContribution: { type: "number" },
          squaredRssContribution: { type: "number" },
        },
        required: ["worstCaseContribution", "squaredRssContribution"],
      },
      ports: {
        inputs: [
          {
            id: "sensitivity",
            label: "Sensitivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "halfTolerance",
            label: "Half Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "worstCaseContribution",
            label: "Worst Case Contribution",
            valueType: { type: "number" },
          },
          {
            id: "squaredRssContribution",
            label: "Squared Rss Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = productStackupOneToleranceContributionTool.execute;
export default productStackupOneToleranceContributionTool;
