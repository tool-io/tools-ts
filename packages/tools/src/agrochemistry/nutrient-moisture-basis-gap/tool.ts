import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asReceived: number;
  readonly dryFraction: number;
  readonly suppliedDryBasis: number;
};
export type Output = {
  readonly expectedDryBasis: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asReceived: { type: "number", minimum: 0 },
    dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    suppliedDryBasis: { type: "number", minimum: 0 },
  },
  required: ["asReceived", "dryFraction", "suppliedDryBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedDryBasis: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedDryBasis", "residual"],
} as const;
/** Calculate nutrient moisture basis gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asReceived, dryFraction, suppliedDryBasis } = request;
  const compute = (): Output => {
    H.domain(
      asReceived >= 0 &&
        suppliedDryBasis >= 0 &&
        dryFraction > 0 &&
        dryFraction <= 1,
    );
    return {
      expectedDryBasis: asReceived / dryFraction,
      residual: suppliedDryBasis - asReceived / dryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asReceived: 8, dryFraction: 0.8, suppliedDryBasis: 12 },
  output: { expectedDryBasis: 10, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const nutrientMoistureBasisGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/nutrient-moisture-basis-gap",
    title: "Nutrient Moisture Basis Gap Tool",
    description:
      "Calculate nutrient moisture basis gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asReceived: { type: "number", minimum: 0 },
        dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        suppliedDryBasis: { type: "number", minimum: 0 },
      },
      required: ["asReceived", "dryFraction", "suppliedDryBasis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedDryBasis: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedDryBasis", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "asReceived",
          label: "As Received",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDryBasis",
          label: "Supplied Dry Basis",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedDryBasis",
          label: "Expected Dry Basis",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nutrientMoistureBasisGapTool.execute;
export default nutrientMoistureBasisGapTool;
