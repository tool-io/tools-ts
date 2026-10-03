import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseFee: number;
  readonly selectedModules: number;
  readonly totalModules: number;
  readonly fixedCharge: number;
  readonly discountFraction: number;
};
export type Output = {
  readonly scopeShare: number;
  readonly grossFee: number;
  readonly payable: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseFee: { type: "number", minimum: 0 },
    selectedModules: { type: "integer", minimum: 0 },
    totalModules: { type: "integer", minimum: 1 },
    fixedCharge: { type: "number", minimum: 0 },
    discountFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "baseFee",
    "selectedModules",
    "totalModules",
    "fixedCharge",
    "discountFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scopeShare: { type: "number" },
    grossFee: { type: "number" },
    payable: { type: "number" },
  },
  required: ["scopeShare", "grossFee", "payable"],
} as const;
/** Calculate regulatory fee application scope proration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    baseFee,
    selectedModules,
    totalModules,
    fixedCharge,
    discountFraction,
  } = request;
  const compute = (): Output => {
    H.integer(totalModules, 1);
    H.integer(selectedModules, 0, totalModules);
    H.domain(baseFee >= 0 && fixedCharge >= 0);
    H.probability(discountFraction);
    return {
      scopeShare: selectedModules / totalModules,
      grossFee: (baseFee * selectedModules) / totalModules + fixedCharge,
      payable:
        ((baseFee * selectedModules) / totalModules + fixedCharge) *
        (1 - discountFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseFee: 1000,
    selectedModules: 3,
    totalModules: 5,
    fixedCharge: 100,
    discountFraction: 0.1,
  },
  output: { scopeShare: 0.6, grossFee: 700, payable: 630 },
} satisfies ToolExample<Input, Output>;
export const regulatoryFeeApplicationScopeProrationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/regulatory-fee-application-scope-proration",
      title: "Regulatory Fee Application Scope Proration Tool",
      description:
        "Calculate regulatory fee application scope proration from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseFee: { type: "number", minimum: 0 },
          selectedModules: { type: "integer", minimum: 0 },
          totalModules: { type: "integer", minimum: 1 },
          fixedCharge: { type: "number", minimum: 0 },
          discountFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "baseFee",
          "selectedModules",
          "totalModules",
          "fixedCharge",
          "discountFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scopeShare: { type: "number" },
          grossFee: { type: "number" },
          payable: { type: "number" },
        },
        required: ["scopeShare", "grossFee", "payable"],
      },
      ports: {
        inputs: [
          {
            id: "baseFee",
            label: "Base Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "selectedModules",
            label: "Selected Modules",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalModules",
            label: "Total Modules",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "fixedCharge",
            label: "Fixed Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "discountFraction",
            label: "Discount Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "scopeShare",
            label: "Scope Share",
            valueType: { type: "number" },
          },
          { id: "grossFee", label: "Gross Fee", valueType: { type: "number" } },
          { id: "payable", label: "Payable", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = regulatoryFeeApplicationScopeProrationTool.execute;
export default regulatoryFeeApplicationScopeProrationTool;
