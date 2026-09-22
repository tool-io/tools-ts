import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly benefit: number;
  readonly socialDistance: number;
  readonly rate: number;
};
export type Output = {
  readonly discountFactor: number;
  readonly discountedBenefit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benefit: { type: "number" },
    socialDistance: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
  },
  required: ["benefit", "socialDistance", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountFactor: { type: "number" },
    discountedBenefit: { type: "number" },
  },
  required: ["discountFactor", "discountedBenefit"],
} as const;
/** Caller-parameterized hyperbolic social-distance model, without inferring interpersonal deservingness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { benefit, socialDistance, rate } = request;
  const compute = (): Output => {
    H.domain(socialDistance >= 0 && rate >= 0);
    return {
      discountFactor: 1 / (1 + rate * socialDistance),
      discountedBenefit: benefit / (1 + rate * socialDistance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { benefit: 100, socialDistance: 5, rate: 0.2 },
  output: { discountFactor: 0.5, discountedBenefit: 50 },
} satisfies ToolExample<Input, Output>;
export const socialDiscountRecipientDistanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "behavioral-economics/social-discount-recipient-distance-term",
      title: "Social Discount Recipient Distance Term Tool",
      description:
        "Caller-parameterized hyperbolic social-distance model, without inferring interpersonal deservingness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          benefit: { type: "number" },
          socialDistance: { type: "number", minimum: 0 },
          rate: { type: "number", minimum: 0 },
        },
        required: ["benefit", "socialDistance", "rate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          discountFactor: { type: "number" },
          discountedBenefit: { type: "number" },
        },
        required: ["discountFactor", "discountedBenefit"],
      },
      ports: {
        inputs: [
          {
            id: "benefit",
            label: "Benefit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "socialDistance",
            label: "Social Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rate",
            label: "Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "discountFactor",
            label: "Discount Factor",
            valueType: { type: "number" },
          },
          {
            id: "discountedBenefit",
            label: "Discounted Benefit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = socialDiscountRecipientDistanceTermTool.execute;
export default socialDiscountRecipientDistanceTermTool;
