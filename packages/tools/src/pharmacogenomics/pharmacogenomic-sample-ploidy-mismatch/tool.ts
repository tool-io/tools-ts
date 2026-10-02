import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expected: number;
  readonly calledCopies: number;
  readonly unknownCopies: number;
};
export type Output = {
  readonly knownGap: number;
  readonly possibleMinimum: number;
  readonly possibleMaximum: number;
  readonly definitelyMismatch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expected: { type: "integer", minimum: 0 },
    calledCopies: { type: "integer", minimum: 0 },
    unknownCopies: { type: "integer", minimum: 0 },
  },
  required: ["expected", "calledCopies", "unknownCopies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownGap: { type: "integer" },
    possibleMinimum: { type: "integer" },
    possibleMaximum: { type: "integer" },
    definitelyMismatch: { type: "boolean" },
  },
  required: [
    "knownGap",
    "possibleMinimum",
    "possibleMaximum",
    "definitelyMismatch",
  ],
} as const;
/** Calculate pharmacogenomic sample ploidy mismatch from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expected, calledCopies, unknownCopies } = request;
  const compute = (): Output => {
    H.integer(expected, 0);
    H.integer(calledCopies, 0);
    H.integer(unknownCopies, 0);
    return {
      knownGap: calledCopies - expected,
      possibleMinimum: calledCopies,
      possibleMaximum: calledCopies + unknownCopies,
      definitelyMismatch:
        expected < calledCopies || expected > calledCopies + unknownCopies,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expected: 2, calledCopies: 1, unknownCopies: 1 },
  output: {
    knownGap: -1,
    possibleMinimum: 1,
    possibleMaximum: 2,
    definitelyMismatch: false,
  },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicSamplePloidyMismatchTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogenomic-sample-ploidy-mismatch",
      title: "Pharmacogenomic Sample Ploidy Mismatch Tool",
      description:
        "Calculate pharmacogenomic sample ploidy mismatch from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expected: { type: "integer", minimum: 0 },
          calledCopies: { type: "integer", minimum: 0 },
          unknownCopies: { type: "integer", minimum: 0 },
        },
        required: ["expected", "calledCopies", "unknownCopies"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          knownGap: { type: "integer" },
          possibleMinimum: { type: "integer" },
          possibleMaximum: { type: "integer" },
          definitelyMismatch: { type: "boolean" },
        },
        required: [
          "knownGap",
          "possibleMinimum",
          "possibleMaximum",
          "definitelyMismatch",
        ],
      },
      ports: {
        inputs: [
          {
            id: "expected",
            label: "Expected",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "calledCopies",
            label: "Called Copies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unknownCopies",
            label: "Unknown Copies",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "knownGap",
            label: "Known Gap",
            valueType: { type: "integer" },
          },
          {
            id: "possibleMinimum",
            label: "Possible Minimum",
            valueType: { type: "integer" },
          },
          {
            id: "possibleMaximum",
            label: "Possible Maximum",
            valueType: { type: "integer" },
          },
          {
            id: "definitelyMismatch",
            label: "Definitely Mismatch",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogenomicSamplePloidyMismatchTool.execute;
export default pharmacogenomicSamplePloidyMismatchTool;
