import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cash: number;
  readonly quantity: number;
  readonly localUnitValue: number;
  readonly transferCost: number;
  readonly lossFraction: number;
};
export type Output = {
  readonly grossInkind: number;
  readonly deliveredInkindValue: number;
  readonly netDeliveredValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cash: { type: "number" },
    quantity: { type: "number", minimum: 0 },
    localUnitValue: { type: "number", minimum: 0 },
    transferCost: { type: "number", minimum: 0 },
    lossFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "cash",
    "quantity",
    "localUnitValue",
    "transferCost",
    "lossFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossInkind: { type: "number" },
    deliveredInkindValue: { type: "number" },
    netDeliveredValue: { type: "number" },
  },
  required: ["grossInkind", "deliveredInkindValue", "netDeliveredValue"],
} as const;
/** Caller-valued in-kind delivery and cash accounting in a shared currency, not an aid effectiveness or additionality estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cash, quantity, localUnitValue, transferCost, lossFraction } =
    request;
  const compute = (): Output => {
    H.domain(quantity >= 0 && localUnitValue >= 0 && transferCost >= 0);
    H.probability(lossFraction);
    return {
      grossInkind: quantity * localUnitValue,
      deliveredInkindValue: quantity * localUnitValue * (1 - lossFraction),
      netDeliveredValue:
        cash + quantity * localUnitValue * (1 - lossFraction) - transferCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cash: 1000,
    quantity: 100,
    localUnitValue: 5,
    transferCost: 200,
    lossFraction: 0.1,
  },
  output: {
    grossInkind: 500,
    deliveredInkindValue: 450,
    netDeliveredValue: 1250,
  },
} satisfies ToolExample<Input, Output>;
export const internationalAidInkindCashCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/international-aid-inkind-cash-crosswalk",
      title: "International Aid Inkind Cash Crosswalk Tool",
      description:
        "Caller-valued in-kind delivery and cash accounting in a shared currency, not an aid effectiveness or additionality estimate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cash: { type: "number" },
          quantity: { type: "number", minimum: 0 },
          localUnitValue: { type: "number", minimum: 0 },
          transferCost: { type: "number", minimum: 0 },
          lossFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "cash",
          "quantity",
          "localUnitValue",
          "transferCost",
          "lossFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossInkind: { type: "number" },
          deliveredInkindValue: { type: "number" },
          netDeliveredValue: { type: "number" },
        },
        required: ["grossInkind", "deliveredInkindValue", "netDeliveredValue"],
      },
      ports: {
        inputs: [
          {
            id: "cash",
            label: "Cash",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quantity",
            label: "Quantity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "localUnitValue",
            label: "Local Unit Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transferCost",
            label: "Transfer Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lossFraction",
            label: "Loss Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "grossInkind",
            label: "Gross Inkind",
            valueType: { type: "number" },
          },
          {
            id: "deliveredInkindValue",
            label: "Delivered Inkind Value",
            valueType: { type: "number" },
          },
          {
            id: "netDeliveredValue",
            label: "Net Delivered Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internationalAidInkindCashCrosswalkTool.execute;
export default internationalAidInkindCashCrosswalkTool;
