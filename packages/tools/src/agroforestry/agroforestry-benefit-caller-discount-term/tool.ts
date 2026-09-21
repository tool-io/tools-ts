import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly benefit: number;
  readonly year: number;
  readonly suppliedRate: number;
};
export type Output = { readonly presentValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benefit: { type: "number" },
    year: { type: "number", minimum: 0 },
    suppliedRate: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["benefit", "year", "suppliedRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { presentValue: { type: "number" } },
  required: ["presentValue"],
} as const;
/** Discount one supplied benefit under an explicit constant-rate convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { benefit, year, suppliedRate } = request;
  const compute = (): Output => {
    H.domain(year >= 0 && suppliedRate > -1);
    return { presentValue: benefit * (1 + suppliedRate) ** -year };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { benefit: 100, year: 2, suppliedRate: 0.1 },
  output: { presentValue: 82.64462809917354 },
} satisfies ToolExample<Input, Output>;
export const agroforestryBenefitCallerDiscountTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroforestry/agroforestry-benefit-caller-discount-term",
      title: "Agroforestry Benefit Caller Discount Term Tool",
      description:
        "Discount one supplied benefit under an explicit constant-rate convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          benefit: { type: "number" },
          year: { type: "number", minimum: 0 },
          suppliedRate: { type: "number", exclusiveMinimum: -1 },
        },
        required: ["benefit", "year", "suppliedRate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { presentValue: { type: "number" } },
        required: ["presentValue"],
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
            id: "year",
            label: "Year",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedRate",
            label: "Supplied Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "presentValue",
            label: "Present Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agroforestryBenefitCallerDiscountTermTool.execute;
export default agroforestryBenefitCallerDiscountTermTool;
