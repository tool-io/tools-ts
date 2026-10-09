import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residentFrequency: number;
  readonly migrantFrequency: number;
  readonly migrationFraction: number;
};
export type Output = { readonly expectedFrequency: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residentFrequency: { type: "number", minimum: 0, maximum: 1 },
    migrantFrequency: { type: "number", minimum: 0, maximum: 1 },
    migrationFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["residentFrequency", "migrantFrequency", "migrationFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedFrequency: { type: "number" } },
  required: ["expectedFrequency"],
} as const;
/** Calculate neutral one-generation expected allele frequency after an explicit migrant fraction, with zero-mean drift excluded from the expectation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residentFrequency, migrantFrequency, migrationFraction } = request;
  const compute = (): Output => {
    (H.domain(
      residentFrequency >= 0 && residentFrequency <= 1,
      "residentFrequency",
    ),
      residentFrequency);
    (H.domain(
      migrantFrequency >= 0 && migrantFrequency <= 1,
      "migrantFrequency",
    ),
      migrantFrequency);
    (H.domain(
      migrationFraction >= 0 && migrationFraction <= 1,
      "migrationFraction",
    ),
      migrationFraction);
    return {
      expectedFrequency:
        (1 - migrationFraction) * residentFrequency +
        migrationFraction * migrantFrequency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    residentFrequency: 0.2,
    migrantFrequency: 0.8,
    migrationFraction: 0.25,
  },
  output: { expectedFrequency: 0.35000000000000003 },
} satisfies ToolExample<Input, Output>;
export const migrationDriftGenerationExpectationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "evolutionary-biology/migration-drift-generation-expectation",
      title: "Migration Drift Generation Expectation Tool",
      description:
        "Calculate neutral one-generation expected allele frequency after an explicit migrant fraction, with zero-mean drift excluded from the expectation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residentFrequency: { type: "number", minimum: 0, maximum: 1 },
          migrantFrequency: { type: "number", minimum: 0, maximum: 1 },
          migrationFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "residentFrequency",
          "migrantFrequency",
          "migrationFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { expectedFrequency: { type: "number" } },
        required: ["expectedFrequency"],
      },
      ports: {
        inputs: [
          {
            id: "residentFrequency",
            label: "Resident Frequency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "migrantFrequency",
            label: "Migrant Frequency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "migrationFraction",
            label: "Migration Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedFrequency",
            label: "Expected Frequency",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = migrationDriftGenerationExpectationTool.execute;
export default migrationDriftGenerationExpectationTool;
