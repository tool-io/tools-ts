import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bushels: number;
  readonly kilogramsPerLocalBushel: number;
  readonly moistureFraction: number;
};
export type Output = {
  readonly wetKilograms: number;
  readonly dryKilograms: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bushels: { type: "number", minimum: 0 },
    kilogramsPerLocalBushel: { type: "number", exclusiveMinimum: 0 },
    moistureFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["bushels", "kilogramsPerLocalBushel", "moistureFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetKilograms: { type: "number" },
    dryKilograms: { type: "number" },
  },
  required: ["wetKilograms", "dryKilograms"],
} as const;
/** Use a caller-documented local bushel mass and wet-basis moisture fraction; no universal bushel mass is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bushels, kilogramsPerLocalBushel, moistureFraction } = request;
  const compute = (): Output => {
    H.domain(bushels >= 0);
    H.positive(kilogramsPerLocalBushel);
    H.probability(moistureFraction);
    return {
      wetKilograms: bushels * kilogramsPerLocalBushel,
      dryKilograms: bushels * kilogramsPerLocalBushel * (1 - moistureFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bushels: 10, kilogramsPerLocalBushel: 25, moistureFraction: 0.2 },
  output: { wetKilograms: 250, dryKilograms: 200 },
} satisfies ToolExample<Input, Output>;
export const archivalBushelWeightLocalFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/archival-bushel-weight-local-factor",
    title: "Archival Bushel Weight Local Factor Tool",
    description:
      "Use a caller-documented local bushel mass and wet-basis moisture fraction; no universal bushel mass is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bushels: { type: "number", minimum: 0 },
        kilogramsPerLocalBushel: { type: "number", exclusiveMinimum: 0 },
        moistureFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["bushels", "kilogramsPerLocalBushel", "moistureFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetKilograms: { type: "number" },
        dryKilograms: { type: "number" },
      },
      required: ["wetKilograms", "dryKilograms"],
    },
    ports: {
      inputs: [
        {
          id: "bushels",
          label: "Bushels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "kilogramsPerLocalBushel",
          label: "Kilograms Per Local Bushel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wetKilograms",
          label: "Wet Kilograms",
          valueType: { type: "number" },
        },
        {
          id: "dryKilograms",
          label: "Dry Kilograms",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = archivalBushelWeightLocalFactorTool.execute;
export default archivalBushelWeightLocalFactorTool;
