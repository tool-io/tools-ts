import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly units: number;
  readonly requiredFraction: number;
  readonly existingAccessible: number;
};
export type Output = { readonly required: number; readonly additional: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    units: { type: "integer", minimum: 0 },
    requiredFraction: { type: "number", minimum: 0, maximum: 1 },
    existingAccessible: { type: "integer", minimum: 0 },
  },
  required: ["units", "requiredFraction", "existingAccessible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: { type: "integer" },
    additional: { type: "integer" },
  },
  required: ["required", "additional"],
} as const;
/** Calculate housing unit accessible share rounding from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { units, requiredFraction, existingAccessible } = request;
  const compute = (): Output => {
    H.integer(units, 0);
    H.probability(requiredFraction);
    H.integer(existingAccessible, 0, units);
    return {
      required: Math.ceil(units * requiredFraction),
      additional: Math.max(
        0,
        Math.ceil(units * requiredFraction) - existingAccessible,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { units: 37, requiredFraction: 0.1, existingAccessible: 2 },
  output: { required: 4, additional: 2 },
} satisfies ToolExample<Input, Output>;
export const housingUnitAccessibleShareRoundingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/housing-unit-accessible-share-rounding",
    title: "Housing Unit Accessible Share Rounding Tool",
    description:
      "Calculate housing unit accessible share rounding from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        units: { type: "integer", minimum: 0 },
        requiredFraction: { type: "number", minimum: 0, maximum: 1 },
        existingAccessible: { type: "integer", minimum: 0 },
      },
      required: ["units", "requiredFraction", "existingAccessible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer" },
        additional: { type: "integer" },
      },
      required: ["required", "additional"],
    },
    ports: {
      inputs: [
        {
          id: "units",
          label: "Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredFraction",
          label: "Required Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "existingAccessible",
          label: "Existing Accessible",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "required", label: "Required", valueType: { type: "integer" } },
        {
          id: "additional",
          label: "Additional",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = housingUnitAccessibleShareRoundingTool.execute;
export default housingUnitAccessibleShareRoundingTool;
