import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frontage: number;
  readonly occupiedFrontage: number;
  readonly requiredFraction: number;
};
export type Output = {
  readonly actualFraction: number;
  readonly requiredLength: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frontage: { type: "number", exclusiveMinimum: 0 },
    occupiedFrontage: { type: "number", minimum: 0 },
    requiredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["frontage", "occupiedFrontage", "requiredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualFraction: { type: "number" },
    requiredLength: { type: "number" },
    gap: { type: "number" },
  },
  required: ["actualFraction", "requiredLength", "gap"],
} as const;
/** Calculate street frontage build to gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frontage, occupiedFrontage, requiredFraction } = request;
  const compute = (): Output => {
    H.positive(frontage);
    H.domain(occupiedFrontage >= 0 && occupiedFrontage <= frontage);
    H.probability(requiredFraction);
    return {
      actualFraction: occupiedFrontage / frontage,
      requiredLength: frontage * requiredFraction,
      gap: occupiedFrontage - frontage * requiredFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frontage: 100, occupiedFrontage: 70, requiredFraction: 0.6 },
  output: { actualFraction: 0.7, requiredLength: 60, gap: 10 },
} satisfies ToolExample<Input, Output>;
export const streetFrontageBuildToGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/street-frontage-build-to-gap",
    title: "Street Frontage Build To Gap Tool",
    description:
      "Calculate street frontage build to gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frontage: { type: "number", exclusiveMinimum: 0 },
        occupiedFrontage: { type: "number", minimum: 0 },
        requiredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["frontage", "occupiedFrontage", "requiredFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualFraction: { type: "number" },
        requiredLength: { type: "number" },
        gap: { type: "number" },
      },
      required: ["actualFraction", "requiredLength", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "frontage",
          label: "Frontage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupiedFrontage",
          label: "Occupied Frontage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredFraction",
          label: "Required Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "actualFraction",
          label: "Actual Fraction",
          valueType: { type: "number" },
        },
        {
          id: "requiredLength",
          label: "Required Length",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = streetFrontageBuildToGapTool.execute;
export default streetFrontageBuildToGapTool;
