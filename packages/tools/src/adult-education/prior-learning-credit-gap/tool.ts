import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredCredits: number;
  readonly assessedCredits: number;
  readonly alreadyApplied: number;
  readonly suppliedCap: number;
};
export type Output = {
  readonly newApplicable: number;
  readonly remainingRequirement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCredits: { type: "number", minimum: 0 },
    assessedCredits: { type: "number", minimum: 0 },
    alreadyApplied: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: [
    "requiredCredits",
    "assessedCredits",
    "alreadyApplied",
    "suppliedCap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newApplicable: { type: "number" },
    remainingRequirement: { type: "number" },
  },
  required: ["newApplicable", "remainingRequirement"],
} as const;
/** Apply supplied prior-learning credit/cap accounting without selecting accreditation policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredCredits, assessedCredits, alreadyApplied, suppliedCap } =
    request;
  const compute = (): Output => {
    H.domain(
      requiredCredits >= 0 &&
        assessedCredits >= 0 &&
        alreadyApplied >= 0 &&
        alreadyApplied <= assessedCredits &&
        suppliedCap >= 0,
    );
    return {
      newApplicable: Math.max(
        0,
        Math.min(
          assessedCredits - alreadyApplied,
          suppliedCap - alreadyApplied,
          requiredCredits - alreadyApplied,
        ),
      ),
      remainingRequirement: Math.max(
        0,
        requiredCredits -
          alreadyApplied -
          Math.max(
            0,
            Math.min(
              assessedCredits - alreadyApplied,
              suppliedCap - alreadyApplied,
              requiredCredits - alreadyApplied,
            ),
          ),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredCredits: 100,
    assessedCredits: 40,
    alreadyApplied: 10,
    suppliedCap: 30,
  },
  output: { newApplicable: 20, remainingRequirement: 70 },
} satisfies ToolExample<Input, Output>;
export const priorLearningCreditGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/prior-learning-credit-gap",
    title: "Prior Learning Credit Gap Tool",
    description:
      "Apply supplied prior-learning credit/cap accounting without selecting accreditation policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCredits: { type: "number", minimum: 0 },
        assessedCredits: { type: "number", minimum: 0 },
        alreadyApplied: { type: "number", minimum: 0 },
        suppliedCap: { type: "number", minimum: 0 },
      },
      required: [
        "requiredCredits",
        "assessedCredits",
        "alreadyApplied",
        "suppliedCap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newApplicable: { type: "number" },
        remainingRequirement: { type: "number" },
      },
      required: ["newApplicable", "remainingRequirement"],
    },
    ports: {
      inputs: [
        {
          id: "requiredCredits",
          label: "Required Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assessedCredits",
          label: "Assessed Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alreadyApplied",
          label: "Already Applied",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newApplicable",
          label: "New Applicable",
          valueType: { type: "number" },
        },
        {
          id: "remainingRequirement",
          label: "Remaining Requirement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = priorLearningCreditGapTool.execute;
export default priorLearningCreditGapTool;
