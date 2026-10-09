import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grantAmount: number;
  readonly requiredMatchPerGrantUnit: number;
  readonly securedCash: number;
};
export type Output = {
  readonly requiredMatch: number;
  readonly shortfall: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grantAmount: { type: "number", minimum: 0 },
    requiredMatchPerGrantUnit: { type: "number", minimum: 0 },
    securedCash: { type: "number", minimum: 0 },
  },
  required: ["grantAmount", "requiredMatchPerGrantUnit", "securedCash"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredMatch: { type: "number" },
    shortfall: { type: "number" },
  },
  required: ["requiredMatch", "shortfall"],
} as const;
/** Calculate an explicit grant matching-cash ratio requirement and nonnegative shortfall without determining funding eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grantAmount, requiredMatchPerGrantUnit, securedCash } = request;
  const compute = (): Output => {
    H.domain(grantAmount >= 0, "grantAmount");
    H.domain(requiredMatchPerGrantUnit >= 0, "requiredMatchPerGrantUnit");
    H.domain(securedCash >= 0, "securedCash");
    return {
      requiredMatch: grantAmount * requiredMatchPerGrantUnit,
      shortfall: Math.max(
        0,
        grantAmount * requiredMatchPerGrantUnit - securedCash,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grantAmount: 1000,
    requiredMatchPerGrantUnit: 0.5,
    securedCash: 300,
  },
  output: { requiredMatch: 500, shortfall: 200 },
} satisfies ToolExample<Input, Output>;
export const ventureGrantMatchingCashRequirementTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entrepreneurship-studies/venture-grant-matching-cash-requirement",
      title: "Venture Grant Matching Cash Requirement Tool",
      description:
        "Calculate an explicit grant matching-cash ratio requirement and nonnegative shortfall without determining funding eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grantAmount: { type: "number", minimum: 0 },
          requiredMatchPerGrantUnit: { type: "number", minimum: 0 },
          securedCash: { type: "number", minimum: 0 },
        },
        required: ["grantAmount", "requiredMatchPerGrantUnit", "securedCash"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredMatch: { type: "number" },
          shortfall: { type: "number" },
        },
        required: ["requiredMatch", "shortfall"],
      },
      ports: {
        inputs: [
          {
            id: "grantAmount",
            label: "Grant Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "requiredMatchPerGrantUnit",
            label: "Required Match Per Grant Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "securedCash",
            label: "Secured Cash",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "requiredMatch",
            label: "Required Match",
            valueType: { type: "number" },
          },
          {
            id: "shortfall",
            label: "Shortfall",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ventureGrantMatchingCashRequirementTool.execute;
export default ventureGrantMatchingCashRequirementTool;
