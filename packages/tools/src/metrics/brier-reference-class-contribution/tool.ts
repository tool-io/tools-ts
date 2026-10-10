import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly classProbability: number;
  readonly observedClass: boolean;
  readonly referenceProbability: number;
};
export type Output = {
  readonly classSquaredError: number;
  readonly referenceSquaredError: number;
  readonly improvement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classProbability: { type: "number", minimum: 0, maximum: 1 },
    observedClass: { type: "boolean" },
    referenceProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["classProbability", "observedClass", "referenceProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classSquaredError: { type: "number" },
    referenceSquaredError: { type: "number" },
    improvement: { type: "number" },
  },
  required: ["classSquaredError", "referenceSquaredError", "improvement"],
} as const;
/** Compare one explicit class Brier contribution with a supplied reference probability under the same binary observation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { classProbability, observedClass, referenceProbability } = request;
  const compute = (): Output => {
    return (() => {
      (H.domain(
        classProbability >= 0 && classProbability <= 1,
        "classProbability",
      ),
        classProbability);
      (H.domain(
        referenceProbability >= 0 && referenceProbability <= 1,
        "referenceProbability",
      ),
        referenceProbability);
      const observation = observedClass ? 1 : 0,
        classSquaredError = (classProbability - observation) ** 2,
        referenceSquaredError = (referenceProbability - observation) ** 2;
      return {
        classSquaredError,
        referenceSquaredError,
        improvement: referenceSquaredError - classSquaredError,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    classProbability: 0.5,
    observedClass: true,
    referenceProbability: 0.25,
  },
  output: {
    classSquaredError: 0.25,
    referenceSquaredError: 0.5625,
    improvement: 0.3125,
  },
} satisfies ToolExample<Input, Output>;
export const brierReferenceClassContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["metrics", "evaluation metrics", "computer science"],
      keywords: ["evaluation metrics", "computer science"],
    },
    id: "metrics/brier-reference-class-contribution",
    title: "Brier Reference Class Contribution",
    description:
      "Compare one explicit class Brier contribution with a supplied reference probability under the same binary observation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classProbability: { type: "number", minimum: 0, maximum: 1 },
        observedClass: { type: "boolean" },
        referenceProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["classProbability", "observedClass", "referenceProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classSquaredError: { type: "number" },
        referenceSquaredError: { type: "number" },
        improvement: { type: "number" },
      },
      required: ["classSquaredError", "referenceSquaredError", "improvement"],
    },
    ports: {
      inputs: [
        {
          id: "classProbability",
          label: "Class Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedClass",
          label: "Observed Class",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "referenceProbability",
          label: "Reference Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "classSquaredError",
          label: "Class Squared Error",
          valueType: { type: "number" },
        },
        {
          id: "referenceSquaredError",
          label: "Reference Squared Error",
          valueType: { type: "number" },
        },
        {
          id: "improvement",
          label: "Improvement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = brierReferenceClassContributionTool.execute;
export default brierReferenceClassContributionTool;
