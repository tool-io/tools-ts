import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifier: string;
  readonly trainingIds: readonly string[];
  readonly testIds: readonly string[];
};
export type Output = {
  readonly inTraining: boolean;
  readonly inTest: boolean;
  readonly collision: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifier: { type: "string", maxLength: 8192 },
    trainingIds: {
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
  required: ["identifier", "trainingIds", "testIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inTraining: { type: "boolean" },
    inTest: { type: "boolean" },
    collision: { type: "boolean" },
  },
  required: ["inTraining", "inTest", "collision"],
} as const;
/** Check one exact row identifier for membership in explicit training and test ID sets without detecting broader leakage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier, trainingIds, testIds } = request;
  const compute = (): Output => {
    const inTraining = trainingIds.includes(identifier),
      inTest = testIds.includes(identifier);
    return { inTraining, inTest, collision: inTraining && inTest };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "R17", trainingIds: ["R17", "R2"], testIds: ["R17"] },
  output: { inTraining: true, inTest: true, collision: true },
} satisfies ToolExample<Input, Output>;
export const trainTestSingleIdentifierCollisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/train-test-single-identifier-collision",
    title: "Train Test Single Identifier Collision",
    description:
      "Check one exact row identifier for membership in explicit training and test ID sets without detecting broader leakage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identifier: { type: "string", maxLength: 8192 },
        trainingIds: {
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
      required: ["identifier", "trainingIds", "testIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inTraining: { type: "boolean" },
        inTest: { type: "boolean" },
        collision: { type: "boolean" },
      },
      required: ["inTraining", "inTest", "collision"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trainingIds",
          label: "Training Ids",
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
          id: "inTraining",
          label: "In Training",
          valueType: { type: "boolean" },
        },
        { id: "inTest", label: "In Test", valueType: { type: "boolean" } },
        { id: "collision", label: "Collision", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trainTestSingleIdentifierCollisionTool.execute;
export default trainTestSingleIdentifierCollisionTool;
