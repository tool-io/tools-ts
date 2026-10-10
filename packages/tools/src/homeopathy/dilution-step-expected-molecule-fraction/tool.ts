import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialExpectedMolecules: number;
  readonly retainedFraction: number;
  readonly steps: number;
};
export type Output = {
  readonly expectedMolecules: number;
  readonly remainingFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialExpectedMolecules: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
    steps: { type: "integer", minimum: 0 },
  },
  required: ["initialExpectedMolecules", "retainedFraction", "steps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedMolecules: { type: "number" },
    remainingFraction: { type: "number" },
  },
  required: ["expectedMolecules", "remainingFraction"],
} as const;
/** Apply an explicit repeated independent retention fraction to an expected count under ideal mixing; this arithmetic does not establish therapeutic efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialExpectedMolecules, retainedFraction, steps } = request;
  const compute = (): Output => {
    H.domain(initialExpectedMolecules >= 0, "initialExpectedMolecules");
    (H.domain(
      retainedFraction >= 0 && retainedFraction <= 1,
      "retainedFraction",
    ),
      retainedFraction);
    (H.domain(
      Number.isSafeInteger(steps) &&
        steps >= 0 &&
        steps <= Number.MAX_SAFE_INTEGER,
      "steps",
    ),
      steps);
    return {
      expectedMolecules:
        initialExpectedMolecules * Math.pow(retainedFraction, steps),
      remainingFraction: Math.pow(retainedFraction, steps),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialExpectedMolecules: 1000, retainedFraction: 0.1, steps: 2 },
  output: {
    expectedMolecules: 10.000000000000002,
    remainingFraction: 0.010000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const dilutionStepExpectedmoleculeFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["homeopathy", "health and medicine"],
        keywords: ["homeopathy", "health and medicine"],
      },
      id: "homeopathy/dilution-step-expected-molecule-fraction",
      title: "Dilution Step Expected Molecule Fraction",
      description:
        "Apply an explicit repeated independent retention fraction to an expected count under ideal mixing; this arithmetic does not establish therapeutic efficacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialExpectedMolecules: { type: "number", minimum: 0 },
          retainedFraction: { type: "number", minimum: 0, maximum: 1 },
          steps: { type: "integer", minimum: 0 },
        },
        required: ["initialExpectedMolecules", "retainedFraction", "steps"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedMolecules: { type: "number" },
          remainingFraction: { type: "number" },
        },
        required: ["expectedMolecules", "remainingFraction"],
      },
      ports: {
        inputs: [
          {
            id: "initialExpectedMolecules",
            label: "Initial Expected Molecules",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "steps",
            label: "Steps",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "expectedMolecules",
            label: "Expected Molecules",
            valueType: { type: "number" },
          },
          {
            id: "remainingFraction",
            label: "Remaining Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dilutionStepExpectedmoleculeFractionTool.execute;
export default dilutionStepExpectedmoleculeFractionTool;
