import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deliveredWetMass: number;
  readonly deliveredWaterFraction: number;
  readonly contractedWaterFraction: number;
};
export type Output = {
  readonly dryMass: number;
  readonly equivalentContractMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveredWetMass: { type: "number", minimum: 0 },
    deliveredWaterFraction: { type: "number", minimum: 0, maximum: 1 },
    contractedWaterFraction: {
      type: "number",
      minimum: 0,
      exclusiveMaximum: 1,
    },
  },
  required: [
    "deliveredWetMass",
    "deliveredWaterFraction",
    "contractedWaterFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    equivalentContractMass: { type: "number" },
  },
  required: ["dryMass", "equivalentContractMass"],
} as const;
/** Equal-dry-mass conversion using explicitly supplied moisture bases, without interpreting delivery contracts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deliveredWetMass, deliveredWaterFraction, contractedWaterFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      deliveredWetMass >= 0 &&
        deliveredWaterFraction >= 0 &&
        deliveredWaterFraction <= 1 &&
        contractedWaterFraction >= 0 &&
        contractedWaterFraction < 1,
    );
    return {
      dryMass: deliveredWetMass * (1 - deliveredWaterFraction),
      equivalentContractMass:
        (deliveredWetMass * (1 - deliveredWaterFraction)) /
        (1 - contractedWaterFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deliveredWetMass: 100,
    deliveredWaterFraction: 0.2,
    contractedWaterFraction: 0.1,
  },
  output: { dryMass: 80, equivalentContractMass: 88.88888888888889 },
} satisfies ToolExample<Input, Output>;
export const contractDeliveryMoistureAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/contract-delivery-moisture-adjustment",
    title: "Contract Delivery Moisture Adjustment Tool",
    description:
      "Equal-dry-mass conversion using explicitly supplied moisture bases, without interpreting delivery contracts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveredWetMass: { type: "number", minimum: 0 },
        deliveredWaterFraction: { type: "number", minimum: 0, maximum: 1 },
        contractedWaterFraction: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: [
        "deliveredWetMass",
        "deliveredWaterFraction",
        "contractedWaterFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        equivalentContractMass: { type: "number" },
      },
      required: ["dryMass", "equivalentContractMass"],
    },
    ports: {
      inputs: [
        {
          id: "deliveredWetMass",
          label: "Delivered Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deliveredWaterFraction",
          label: "Delivered Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contractedWaterFraction",
          label: "Contracted Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "equivalentContractMass",
          label: "Equivalent Contract Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = contractDeliveryMoistureAdjustmentTool.execute;
export default contractDeliveryMoistureAdjustmentTool;
