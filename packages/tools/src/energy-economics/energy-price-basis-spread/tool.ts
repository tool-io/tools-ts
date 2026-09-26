import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPrice: number;
  readonly secondPrice: number;
  readonly suppliedFirstUnitFactor: number;
  readonly suppliedSecondUnitFactor: number;
};
export type Output = {
  readonly firstNormalized: number;
  readonly secondNormalized: number;
  readonly spread: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPrice: { type: "number" },
    secondPrice: { type: "number" },
    suppliedFirstUnitFactor: { type: "number", exclusiveMinimum: 0 },
    suppliedSecondUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstPrice",
    "secondPrice",
    "suppliedFirstUnitFactor",
    "suppliedSecondUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstNormalized: { type: "number" },
    secondNormalized: { type: "number" },
    spread: { type: "number" },
  },
  required: ["firstNormalized", "secondNormalized", "spread"],
} as const;
/** Compare signed supplied prices after explicit common-unit normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstPrice,
    secondPrice,
    suppliedFirstUnitFactor,
    suppliedSecondUnitFactor,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedFirstUnitFactor);
    H.positive(suppliedSecondUnitFactor);
    return {
      firstNormalized: firstPrice * suppliedFirstUnitFactor,
      secondNormalized: secondPrice * suppliedSecondUnitFactor,
      spread:
        firstPrice * suppliedFirstUnitFactor -
        secondPrice * suppliedSecondUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPrice: 10,
    secondPrice: 20,
    suppliedFirstUnitFactor: 2,
    suppliedSecondUnitFactor: 0.5,
  },
  output: { firstNormalized: 20, secondNormalized: 10, spread: 10 },
} satisfies ToolExample<Input, Output>;
export const energyPriceBasisSpreadTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/energy-price-basis-spread",
    title: "Energy Price Basis Spread Tool",
    description:
      "Compare signed supplied prices after explicit common-unit normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPrice: { type: "number" },
        secondPrice: { type: "number" },
        suppliedFirstUnitFactor: { type: "number", exclusiveMinimum: 0 },
        suppliedSecondUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstPrice",
        "secondPrice",
        "suppliedFirstUnitFactor",
        "suppliedSecondUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstNormalized: { type: "number" },
        secondNormalized: { type: "number" },
        spread: { type: "number" },
      },
      required: ["firstNormalized", "secondNormalized", "spread"],
    },
    ports: {
      inputs: [
        {
          id: "firstPrice",
          label: "First Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPrice",
          label: "Second Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFirstUnitFactor",
          label: "Supplied First Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSecondUnitFactor",
          label: "Supplied Second Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstNormalized",
          label: "First Normalized",
          valueType: { type: "number" },
        },
        {
          id: "secondNormalized",
          label: "Second Normalized",
          valueType: { type: "number" },
        },
        { id: "spread", label: "Spread", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = energyPriceBasisSpreadTool.execute;
export default energyPriceBasisSpreadTool;
