import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMwh: number;
  readonly deliveredMwh: number;
  readonly compensatedFraction: number;
  readonly contractPrice: number;
};
export type Output = {
  readonly curtailedMwh: number;
  readonly compensatedMwh: number;
  readonly payment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMwh: { type: "number", minimum: 0 },
    deliveredMwh: { type: "number", minimum: 0 },
    compensatedFraction: { type: "number", minimum: 0, maximum: 1 },
    contractPrice: { type: "number" },
  },
  required: [
    "availableMwh",
    "deliveredMwh",
    "compensatedFraction",
    "contractPrice",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    curtailedMwh: { type: "number" },
    compensatedMwh: { type: "number" },
    payment: { type: "number" },
  },
  required: ["curtailedMwh", "compensatedMwh", "payment"],
} as const;
/** Calculate power purchase curtailment compensation term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMwh, deliveredMwh, compensatedFraction, contractPrice } =
    request;
  const compute = (): Output => {
    H.domain(
      availableMwh >= 0 && deliveredMwh >= 0 && deliveredMwh <= availableMwh,
    );
    H.probability(compensatedFraction);
    return {
      curtailedMwh: availableMwh - deliveredMwh,
      compensatedMwh: (availableMwh - deliveredMwh) * compensatedFraction,
      payment:
        (availableMwh - deliveredMwh) * compensatedFraction * contractPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableMwh: 100,
    deliveredMwh: 80,
    compensatedFraction: 0.5,
    contractPrice: 60,
  },
  output: { curtailedMwh: 20, compensatedMwh: 10, payment: 600 },
} satisfies ToolExample<Input, Output>;
export const powerPurchaseCurtailmentCompensationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "energy-economics/power-purchase-curtailment-compensation-term",
      title: "Power Purchase Curtailment Compensation Term Tool",
      description:
        "Calculate power purchase curtailment compensation term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableMwh: { type: "number", minimum: 0 },
          deliveredMwh: { type: "number", minimum: 0 },
          compensatedFraction: { type: "number", minimum: 0, maximum: 1 },
          contractPrice: { type: "number" },
        },
        required: [
          "availableMwh",
          "deliveredMwh",
          "compensatedFraction",
          "contractPrice",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          curtailedMwh: { type: "number" },
          compensatedMwh: { type: "number" },
          payment: { type: "number" },
        },
        required: ["curtailedMwh", "compensatedMwh", "payment"],
      },
      ports: {
        inputs: [
          {
            id: "availableMwh",
            label: "Available Mwh",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deliveredMwh",
            label: "Delivered Mwh",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "compensatedFraction",
            label: "Compensated Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contractPrice",
            label: "Contract Price",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "curtailedMwh",
            label: "Curtailed Mwh",
            valueType: { type: "number" },
          },
          {
            id: "compensatedMwh",
            label: "Compensated Mwh",
            valueType: { type: "number" },
          },
          { id: "payment", label: "Payment", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = powerPurchaseCurtailmentCompensationTermTool.execute;
export default powerPurchaseCurtailmentCompensationTermTool;
