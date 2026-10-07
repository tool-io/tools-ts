import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correctClassCount: number;
  readonly actualClassCount: number;
  readonly numberOfClasses: number;
};
export type Output = {
  readonly classRecall: number;
  readonly balancedAccuracyContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctClassCount: { type: "integer", minimum: 0 },
    actualClassCount: { type: "integer", minimum: 1 },
    numberOfClasses: { type: "integer", minimum: 1 },
  },
  required: ["correctClassCount", "actualClassCount", "numberOfClasses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classRecall: { type: "number" },
    balancedAccuracyContribution: { type: "number" },
  },
  required: ["classRecall", "balancedAccuracyContribution"],
} as const;
/** Calculate one explicit class recall contribution to unweighted multiclass balanced accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correctClassCount, actualClassCount, numberOfClasses } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(actualClassCount) &&
        actualClassCount >= 1 &&
        actualClassCount <= Number.MAX_SAFE_INTEGER,
      "actualClassCount",
    ),
      actualClassCount);
    (H.domain(
      Number.isSafeInteger(correctClassCount) &&
        correctClassCount >= 0 &&
        correctClassCount <= actualClassCount,
      "correctClassCount",
    ),
      correctClassCount);
    (H.domain(
      Number.isSafeInteger(numberOfClasses) &&
        numberOfClasses >= 1 &&
        numberOfClasses <= Number.MAX_SAFE_INTEGER,
      "numberOfClasses",
    ),
      numberOfClasses);
    return {
      classRecall: correctClassCount / actualClassCount,
      balancedAccuracyContribution:
        correctClassCount / actualClassCount / numberOfClasses,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correctClassCount: 8, actualClassCount: 10, numberOfClasses: 4 },
  output: { classRecall: 0.8, balancedAccuracyContribution: 0.2 },
} satisfies ToolExample<Input, Output>;
export const balancedAccuracySingleClassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["classification", "classification metrics", "computer science"],
      keywords: ["classification metrics", "computer science"],
    },
    id: "classification/balanced-accuracy-single-class-term",
    title: "Balanced Accuracy Single Class Term",
    description:
      "Calculate one explicit class recall contribution to unweighted multiclass balanced accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctClassCount: { type: "integer", minimum: 0 },
        actualClassCount: { type: "integer", minimum: 1 },
        numberOfClasses: { type: "integer", minimum: 1 },
      },
      required: ["correctClassCount", "actualClassCount", "numberOfClasses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classRecall: { type: "number" },
        balancedAccuracyContribution: { type: "number" },
      },
      required: ["classRecall", "balancedAccuracyContribution"],
    },
    ports: {
      inputs: [
        {
          id: "correctClassCount",
          label: "Correct Class Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "actualClassCount",
          label: "Actual Class Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "numberOfClasses",
          label: "Number Of Classes",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "classRecall",
          label: "Class Recall",
          valueType: { type: "number" },
        },
        {
          id: "balancedAccuracyContribution",
          label: "Balanced Accuracy Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = balancedAccuracySingleClassTermTool.execute;
export default balancedAccuracySingleClassTermTool;
