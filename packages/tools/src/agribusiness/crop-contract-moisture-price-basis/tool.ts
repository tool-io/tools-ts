import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deliveredMass: number;
  readonly actualMoistureFraction: number;
  readonly contractMoistureFraction: number;
  readonly pricePerContractMass: number;
};
export type Output = {
  readonly equivalentContractMass: number;
  readonly value: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveredMass: { type: "number", minimum: 0 },
    actualMoistureFraction: { type: "number", minimum: 0, maximum: 1 },
    contractMoistureFraction: {
      type: "number",
      minimum: 0,
      exclusiveMaximum: 1,
    },
    pricePerContractMass: { type: "number", minimum: 0 },
  },
  required: [
    "deliveredMass",
    "actualMoistureFraction",
    "contractMoistureFraction",
    "pricePerContractMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentContractMass: { type: "number" },
    value: { type: "number" },
  },
  required: ["equivalentContractMass", "value"],
} as const;
/** Convert delivered crop mass to a supplied contract moisture basis by dry-matter conservation; drying charges and grade adjustments are separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    deliveredMass,
    actualMoistureFraction,
    contractMoistureFraction,
    pricePerContractMass,
  } = request;
  const compute = (): Output => {
    H.domain(deliveredMass >= 0 && pricePerContractMass >= 0, "deliveredMass");
    H.domain(
      actualMoistureFraction >= 0 && actualMoistureFraction <= 1,
      "actualMoistureFraction",
    );
    H.domain(
      contractMoistureFraction >= 0 && contractMoistureFraction < 1,
      "contractMoistureFraction",
    );
    return (() => {
      const equivalentContractMass =
        (deliveredMass * (1 - actualMoistureFraction)) /
        (1 - contractMoistureFraction);
      return {
        equivalentContractMass,
        value: equivalentContractMass * pricePerContractMass,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deliveredMass: 1000,
    actualMoistureFraction: 0.2,
    contractMoistureFraction: 0.1,
    pricePerContractMass: 2,
  },
  output: {
    equivalentContractMass: 888.8888888888889,
    value: 1777.7777777777778,
  },
} satisfies ToolExample<Input, Output>;
export const cropContractMoisturePriceBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/crop-contract-moisture-price-basis",
    title: "Crop Contract Moisture Price Basis",
    description:
      "Convert delivered crop mass to a supplied contract moisture basis by dry-matter conservation; drying charges and grade adjustments are separate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveredMass: { type: "number", minimum: 0 },
        actualMoistureFraction: { type: "number", minimum: 0, maximum: 1 },
        contractMoistureFraction: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1,
        },
        pricePerContractMass: { type: "number", minimum: 0 },
      },
      required: [
        "deliveredMass",
        "actualMoistureFraction",
        "contractMoistureFraction",
        "pricePerContractMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentContractMass: { type: "number" },
        value: { type: "number" },
      },
      required: ["equivalentContractMass", "value"],
    },
    ports: {
      inputs: [
        {
          id: "deliveredMass",
          label: "Delivered Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualMoistureFraction",
          label: "Actual Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contractMoistureFraction",
          label: "Contract Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pricePerContractMass",
          label: "Price Per Contract Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentContractMass",
          label: "Equivalent Contract Mass",
          valueType: { type: "number" },
        },
        { id: "value", label: "Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cropContractMoisturePriceBasisTool.execute;
export default cropContractMoisturePriceBasisTool;
