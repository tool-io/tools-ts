import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCredits: number;
  readonly resitCredits: number;
  readonly reusable: number;
  readonly requiredCredits: number;
};
export type Output = {
  readonly uniqueCredits: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCredits: { type: "number", minimum: 0 },
    resitCredits: { type: "number", minimum: 0 },
    reusable: { type: "number", minimum: 0 },
    requiredCredits: { type: "number", minimum: 0 },
  },
  required: ["previousCredits", "resitCredits", "reusable", "requiredCredits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueCredits: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["uniqueCredits", "remaining"],
} as const;
/** Deduplicate supplied overlapping resit credits under a caller-defined credit system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCredits, resitCredits, reusable, requiredCredits } = request;
  const compute = (): Output => {
    H.domain(
      previousCredits >= 0 &&
        resitCredits >= 0 &&
        reusable >= 0 &&
        reusable <= Math.min(previousCredits, resitCredits) &&
        requiredCredits >= 0,
    );
    return {
      uniqueCredits: previousCredits + resitCredits - reusable,
      remaining: Math.max(
        0,
        requiredCredits - previousCredits - resitCredits + reusable,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousCredits: 20,
    resitCredits: 10,
    reusable: 5,
    requiredCredits: 30,
  },
  output: { uniqueCredits: 25, remaining: 5 },
} satisfies ToolExample<Input, Output>;
export const courseResitCreditReuseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/course-resit-credit-reuse",
    title: "Course Resit Credit Reuse Tool",
    description:
      "Deduplicate supplied overlapping resit credits under a caller-defined credit system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCredits: { type: "number", minimum: 0 },
        resitCredits: { type: "number", minimum: 0 },
        reusable: { type: "number", minimum: 0 },
        requiredCredits: { type: "number", minimum: 0 },
      },
      required: [
        "previousCredits",
        "resitCredits",
        "reusable",
        "requiredCredits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueCredits: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["uniqueCredits", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "previousCredits",
          label: "Previous Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resitCredits",
          label: "Resit Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reusable",
          label: "Reusable",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredCredits",
          label: "Required Credits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueCredits",
          label: "Unique Credits",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = courseResitCreditReuseTool.execute;
export default courseResitCreditReuseTool;
