import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trainingIds: readonly string[];
  readonly validationIds: readonly string[];
  readonly testIds: readonly string[];
};
export type Output = {
  readonly trainValidation: readonly string[];
  readonly trainTest: readonly string[];
  readonly validationTest: readonly string[];
  readonly leakage: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trainingIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    validationIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    testIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["trainingIds", "validationIds", "testIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trainValidation: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    trainTest: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    validationTest: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    leakage: { type: "boolean" },
  },
  required: ["trainValidation", "trainTest", "validationTest", "leakage"],
} as const;
/** Detect overlap among explicitly supplied research subject split IDs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trainingIds, validationIds, testIds } = request;
  const compute = (): Output => {
    const unique = (x: readonly string[]) => [...new Set(x)],
      trainValidation = unique(
        trainingIds.filter((x) => validationIds.includes(x)),
      ),
      trainTest = unique(trainingIds.filter((x) => testIds.includes(x))),
      validationTest = unique(validationIds.filter((x) => testIds.includes(x)));
    return {
      trainValidation,
      trainTest,
      validationTest,
      leakage:
        trainValidation.length + trainTest.length + validationTest.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trainingIds: ["A", "B"],
    validationIds: ["B", "C"],
    testIds: ["D", "C"],
  },
  output: {
    trainValidation: ["B"],
    trainTest: [],
    validationTest: ["C"],
    leakage: true,
  },
} satisfies ToolExample<Input, Output>;
export const biometricResearchSubjectSplitOverlapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-research-subject-split-overlap",
      title: "Biometric Research Subject Split Overlap Tool",
      description:
        "Detect overlap among explicitly supplied research subject split IDs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trainingIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          validationIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          testIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["trainingIds", "validationIds", "testIds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trainValidation: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          trainTest: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          validationTest: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          leakage: { type: "boolean" },
        },
        required: ["trainValidation", "trainTest", "validationTest", "leakage"],
      },
      ports: {
        inputs: [
          {
            id: "trainingIds",
            label: "Training Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "validationIds",
            label: "Validation Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "testIds",
            label: "Test Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "trainValidation",
            label: "Train Validation",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "trainTest",
            label: "Train Test",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "validationTest",
            label: "Validation Test",
            valueType: { type: "list", items: { type: "string" } },
          },
          { id: "leakage", label: "Leakage", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = biometricResearchSubjectSplitOverlapTool.execute;
export default biometricResearchSubjectSplitOverlapTool;
