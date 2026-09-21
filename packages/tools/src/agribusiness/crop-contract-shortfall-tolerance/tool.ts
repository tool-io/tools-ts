import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contractQuantity: number;
  readonly delivered: number;
  readonly toleranceFraction: number;
  readonly suppliedPenalty: number;
};
export type Output = {
  readonly penalizedShortfall: number;
  readonly penalty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contractQuantity: { type: "number", minimum: 0 },
    delivered: { type: "number", minimum: 0 },
    toleranceFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedPenalty: { type: "number", minimum: 0 },
  },
  required: [
    "contractQuantity",
    "delivered",
    "toleranceFraction",
    "suppliedPenalty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    penalizedShortfall: { type: "number" },
    penalty: { type: "number" },
  },
  required: ["penalizedShortfall", "penalty"],
} as const;
/** Calculate crop contract shortfall tolerance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contractQuantity, delivered, toleranceFraction, suppliedPenalty } =
    request;
  const compute = (): Output => {
    H.domain(contractQuantity >= 0 && delivered >= 0 && suppliedPenalty >= 0);
    H.probability(toleranceFraction);
    return {
      penalizedShortfall: Math.max(
        0,
        contractQuantity * (1 - toleranceFraction) - delivered,
      ),
      penalty:
        Math.max(0, contractQuantity * (1 - toleranceFraction) - delivered) *
        suppliedPenalty,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contractQuantity: 100,
    delivered: 90,
    toleranceFraction: 0.05,
    suppliedPenalty: 2,
  },
  output: { penalizedShortfall: 5, penalty: 10 },
} satisfies ToolExample<Input, Output>;
export const cropContractShortfallToleranceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/crop-contract-shortfall-tolerance",
    title: "Crop Contract Shortfall Tolerance Tool",
    description:
      "Calculate crop contract shortfall tolerance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contractQuantity: { type: "number", minimum: 0 },
        delivered: { type: "number", minimum: 0 },
        toleranceFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedPenalty: { type: "number", minimum: 0 },
      },
      required: [
        "contractQuantity",
        "delivered",
        "toleranceFraction",
        "suppliedPenalty",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        penalizedShortfall: { type: "number" },
        penalty: { type: "number" },
      },
      required: ["penalizedShortfall", "penalty"],
    },
    ports: {
      inputs: [
        {
          id: "contractQuantity",
          label: "Contract Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delivered",
          label: "Delivered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toleranceFraction",
          label: "Tolerance Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "suppliedPenalty",
          label: "Supplied Penalty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "penalizedShortfall",
          label: "Penalized Shortfall",
          valueType: { type: "number" },
        },
        { id: "penalty", label: "Penalty", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cropContractShortfallToleranceTool.execute;
export default cropContractShortfallToleranceTool;
