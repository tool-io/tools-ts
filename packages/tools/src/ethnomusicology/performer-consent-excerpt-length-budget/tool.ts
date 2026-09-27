import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorizedSeconds: number;
  readonly usedSeconds: number;
  readonly proposedSeconds: number;
};
export type Output = {
  readonly remainingBefore: number;
  readonly remainingAfter: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorizedSeconds: { type: "number", minimum: 0 },
    usedSeconds: { type: "number", minimum: 0 },
    proposedSeconds: { type: "number", minimum: 0 },
  },
  required: ["authorizedSeconds", "usedSeconds", "proposedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingBefore: { type: "number" },
    remainingAfter: { type: "number" },
    fits: { type: "boolean" },
  },
  required: ["remainingBefore", "remainingAfter", "fits"],
} as const;
/** Excerpt duration budget from explicit permission terms; does not determine consent validity or rights clearance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorizedSeconds, usedSeconds, proposedSeconds } = request;
  const compute = (): Output => {
    H.domain(
      authorizedSeconds >= 0 && usedSeconds >= 0 && proposedSeconds >= 0,
    );
    return {
      remainingBefore: authorizedSeconds - usedSeconds,
      remainingAfter: authorizedSeconds - usedSeconds - proposedSeconds,
      fits: usedSeconds + proposedSeconds <= authorizedSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorizedSeconds: 120, usedSeconds: 50, proposedSeconds: 30 },
  output: { remainingBefore: 70, remainingAfter: 40, fits: true },
} satisfies ToolExample<Input, Output>;
export const performerConsentExcerptLengthBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethnomusicology/performer-consent-excerpt-length-budget",
      title: "Performer Consent Excerpt Length Budget Tool",
      description:
        "Excerpt duration budget from explicit permission terms; does not determine consent validity or rights clearance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          authorizedSeconds: { type: "number", minimum: 0 },
          usedSeconds: { type: "number", minimum: 0 },
          proposedSeconds: { type: "number", minimum: 0 },
        },
        required: ["authorizedSeconds", "usedSeconds", "proposedSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingBefore: { type: "number" },
          remainingAfter: { type: "number" },
          fits: { type: "boolean" },
        },
        required: ["remainingBefore", "remainingAfter", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "authorizedSeconds",
            label: "Authorized Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "usedSeconds",
            label: "Used Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "proposedSeconds",
            label: "Proposed Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
        ],
        outputs: [
          {
            id: "remainingBefore",
            label: "Remaining Before",
            valueType: { type: "number" },
          },
          {
            id: "remainingAfter",
            label: "Remaining After",
            valueType: { type: "number" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = performerConsentExcerptLengthBudgetTool.execute;
export default performerConsentExcerptLengthBudgetTool;
