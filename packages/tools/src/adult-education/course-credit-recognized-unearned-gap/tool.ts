import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredCredits: number;
  readonly earnedCredits: number;
  readonly recognizedPriorCredits: number;
  readonly overlapCredits: number;
};
export type Output = {
  readonly netCompleted: number;
  readonly remaining: number;
  readonly surplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCredits: { type: "number", minimum: 0 },
    earnedCredits: { type: "number", minimum: 0 },
    recognizedPriorCredits: { type: "number", minimum: 0 },
    overlapCredits: { type: "number", minimum: 0 },
  },
  required: [
    "requiredCredits",
    "earnedCredits",
    "recognizedPriorCredits",
    "overlapCredits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCompleted: { type: "number" },
    remaining: { type: "number" },
    surplus: { type: "number" },
  },
  required: ["netCompleted", "remaining", "surplus"],
} as const;
/** Calculate course credit recognized unearned gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requiredCredits,
    earnedCredits,
    recognizedPriorCredits,
    overlapCredits,
  } = request;
  const compute = (): Output => {
    H.domain(
      requiredCredits >= 0 &&
        earnedCredits >= 0 &&
        recognizedPriorCredits >= 0 &&
        overlapCredits >= 0 &&
        overlapCredits <= Math.min(earnedCredits, recognizedPriorCredits),
    );
    return {
      netCompleted: earnedCredits + recognizedPriorCredits - overlapCredits,
      remaining: Math.max(
        0,
        requiredCredits -
          earnedCredits -
          recognizedPriorCredits +
          overlapCredits,
      ),
      surplus: Math.max(
        0,
        earnedCredits +
          recognizedPriorCredits -
          overlapCredits -
          requiredCredits,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredCredits: 120,
    earnedCredits: 60,
    recognizedPriorCredits: 30,
    overlapCredits: 10,
  },
  output: { netCompleted: 80, remaining: 40, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const courseCreditRecognizedUnearnedGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/course-credit-recognized-unearned-gap",
    title: "Course Credit Recognized Unearned Gap Tool",
    description:
      "Calculate course credit recognized unearned gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCredits: { type: "number", minimum: 0 },
        earnedCredits: { type: "number", minimum: 0 },
        recognizedPriorCredits: { type: "number", minimum: 0 },
        overlapCredits: { type: "number", minimum: 0 },
      },
      required: [
        "requiredCredits",
        "earnedCredits",
        "recognizedPriorCredits",
        "overlapCredits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netCompleted: { type: "number" },
        remaining: { type: "number" },
        surplus: { type: "number" },
      },
      required: ["netCompleted", "remaining", "surplus"],
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
          id: "earnedCredits",
          label: "Earned Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recognizedPriorCredits",
          label: "Recognized Prior Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapCredits",
          label: "Overlap Credits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netCompleted",
          label: "Net Completed",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = courseCreditRecognizedUnearnedGapTool.execute;
export default courseCreditRecognizedUnearnedGapTool;
