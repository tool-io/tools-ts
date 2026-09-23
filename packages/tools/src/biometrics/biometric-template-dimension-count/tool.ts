import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinates: readonly number[];
  readonly expectedDimension: number;
};
export type Output = {
  readonly dimension: number;
  readonly difference: number;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
    expectedDimension: { type: "integer", minimum: 0 },
  },
  required: ["coordinates", "expectedDimension"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dimension: { type: "integer" },
    difference: { type: "integer" },
    matches: { type: "boolean" },
  },
  required: ["dimension", "difference", "matches"],
} as const;
/** Inspect supplied numeric template dimensionality without identifying a person or assessing biometric quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinates, expectedDimension } = request;
  const compute = (): Output => {
    H.integer(expectedDimension, 0);
    return {
      dimension: coordinates.length,
      difference: coordinates.length - expectedDimension,
      matches: coordinates.length === expectedDimension,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinates: [0.2, 0.4, 0.1], expectedDimension: 4 },
  output: { dimension: 3, difference: -1, matches: false },
} satisfies ToolExample<Input, Output>;
export const biometricTemplateDimensionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/biometric-template-dimension-count",
    title: "Biometric Template Dimension Count Tool",
    description:
      "Inspect supplied numeric template dimensionality without identifying a person or assessing biometric quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        expectedDimension: { type: "integer", minimum: 0 },
      },
      required: ["coordinates", "expectedDimension"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dimension: { type: "integer" },
        difference: { type: "integer" },
        matches: { type: "boolean" },
      },
      required: ["dimension", "difference", "matches"],
    },
    ports: {
      inputs: [
        {
          id: "coordinates",
          label: "Coordinates",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "expectedDimension",
          label: "Expected Dimension",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "dimension", label: "Dimension", valueType: { type: "integer" } },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "integer" },
        },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = biometricTemplateDimensionCountTool.execute;
export default biometricTemplateDimensionCountTool;
