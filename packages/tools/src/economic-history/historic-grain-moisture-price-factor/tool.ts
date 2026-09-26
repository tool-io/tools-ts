import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetUnitPrice: number;
  readonly observedMoisture: number;
  readonly referenceMoisture: number;
};
export type Output = {
  readonly referenceUnitPrice: number;
  readonly dryUnitPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetUnitPrice: { type: "number" },
    observedMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    referenceMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["wetUnitPrice", "observedMoisture", "referenceMoisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceUnitPrice: { type: "number" },
    dryUnitPrice: { type: "number" },
  },
  required: ["referenceUnitPrice", "dryUnitPrice"],
} as const;
/** Equal dry-matter value normalization, excluding drying costs and quality effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetUnitPrice, observedMoisture, referenceMoisture } = request;
  const compute = (): Output => {
    H.domain(
      observedMoisture >= 0 &&
        observedMoisture < 1 &&
        referenceMoisture >= 0 &&
        referenceMoisture < 1,
    );
    return {
      referenceUnitPrice:
        (wetUnitPrice * (1 - referenceMoisture)) / (1 - observedMoisture),
      dryUnitPrice: wetUnitPrice / (1 - observedMoisture),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetUnitPrice: 80, observedMoisture: 0.2, referenceMoisture: 0.1 },
  output: { referenceUnitPrice: 90, dryUnitPrice: 100 },
} satisfies ToolExample<Input, Output>;
export const historicGrainMoisturePriceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historic-grain-moisture-price-factor",
    title: "Historic Grain Moisture Price Factor Tool",
    description:
      "Equal dry-matter value normalization, excluding drying costs and quality effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetUnitPrice: { type: "number" },
        observedMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        referenceMoisture: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["wetUnitPrice", "observedMoisture", "referenceMoisture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceUnitPrice: { type: "number" },
        dryUnitPrice: { type: "number" },
      },
      required: ["referenceUnitPrice", "dryUnitPrice"],
    },
    ports: {
      inputs: [
        {
          id: "wetUnitPrice",
          label: "Wet Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedMoisture",
          label: "Observed Moisture",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMoisture",
          label: "Reference Moisture",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceUnitPrice",
          label: "Reference Unit Price",
          valueType: { type: "number" },
        },
        {
          id: "dryUnitPrice",
          label: "Dry Unit Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicGrainMoisturePriceFactorTool.execute;
export default historicGrainMoisturePriceFactorTool;
